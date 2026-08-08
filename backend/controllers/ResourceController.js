const ResourceModel = require("../models/Resource");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const path = require("path");

const uploadToCloudinary = (buffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "StudentResourceHub",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const createResource = async (req, res) => {
  try {
    const { title, department, courseCode, detail, excerpt, labels } = req.body;
    const normalizedCourseCode =
      typeof courseCode === "string" ? courseCode.trim() : courseCode;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File upload is required", success: false });
    }

    // Parse labels from comma-separated string if sent that way
    let parsedLabels = [];
    if (labels) {
      parsedLabels =
        typeof labels === "string"
          ? labels
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : labels;
    }

    console.log("Step 1");
    console.log(req.file);

    console.log("Step 2");

    const ext = path.extname(req.file.originalname).toLowerCase();

    const resourceType = [".jpg", ".jpeg", ".png", ".pdf"].includes(ext)
      ? "image"
      : "raw";

    const uploadedFile = await uploadToCloudinary(
      req.file.buffer,
      resourceType,
    );

    console.log("Cloudinary upload successful:");
    console.log(uploadedFile);
    console.log("Step 3");
    console.log(uploadedFile);

    // const uploadedFile = await uploadToCloudinary(
    //   req.file.buffer,
    //   req.file.originalname,
    // );

    const newResource = new ResourceModel({
      title,
      author: req.user._id,
      department,
      courseCode: normalizedCourseCode || "",
      detail,
      excerpt,
      labels: parsedLabels,

      fileUrl: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      resourceType: uploadedFile.resource_type,

      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    console.log("Step 4");
    console.log(newResource);

    await newResource.save();

    console.log("Step 5 - Saved successfully");

    res.status(201).json({
      message: "Resource uploaded successfully",
      success: true,
      resource: newResource,
    });
  } catch (err) {
    console.error("========== CREATE RESOURCE ERROR ==========");
    console.dir(err, { depth: null });

    if (err.response) {
      console.log("Response:");
      console.dir(err.response, { depth: null });
    }

    if (err.error) {
      console.log("Error:");
      console.dir(err.error, { depth: null });
    }

    console.error("==========================================");
    res.status(500).json({
      message: "Internal server error while uploading resource",
      success: false,
    });
  }
};

const getResources = async (req, res) => {
  try {
    const { department, search, myUploads } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    if (myUploads === "true" && req.user) {
      query.author = req.user._id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await ResourceModel.find(query)
      .populate("author", "name email")
      .sort({ postedAt: -1 });

    // Format to make it easy for frontend to consume (e.g. author name as string)
    const formattedResources = resources.map((resource) => {
      const doc = resource.toObject();
      return {
        ...doc,
        id: doc._id,
        author: doc.author ? doc.author.name : "Unknown User",
        authorEmail: doc.author ? doc.author.email : "",
        authorId: doc.author ? doc.author._id : null,
      };
    });

    res.status(200).json({
      success: true,
      resources: formattedResources,
    });
  } catch (err) {
    console.error("========== CREATE RESOURCE ERROR ==========");
    console.dir(err, { depth: null });

    if (err.response) {
      console.log("Response:");
      console.dir(err.response, { depth: null });
    }

    if (err.error) {
      console.log("Error:");
      console.dir(err.error, { depth: null });
    }

    console.error("==========================================");
    res.status(500).json({
      message: "Internal server error while fetching resources",
      success: false,
    });
  }
};

const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await ResourceModel.findById(id).populate(
      "author",
      "name email",
    );
    if (!resource) {
      return res
        .status(404)
        .json({ message: "Resource not found", success: false });
    }

    const doc = resource.toObject();
    const formatted = {
      ...doc,
      id: doc._id,
      author: doc.author ? doc.author.name : "Unknown User",
      authorEmail: doc.author ? doc.author.email : "",
      authorId: doc.author ? doc.author._id : null,
    };

    res.status(200).json({
      success: true,
      resource: formatted,
    });
  } catch (err) {
    console.error("========== CREATE RESOURCE ERROR ==========");
    console.dir(err, { depth: null });

    if (err.response) {
      console.log("Response:");
      console.dir(err.response, { depth: null });
    }

    if (err.error) {
      console.log("Error:");
      console.dir(err.error, { depth: null });
    }

    console.error("==========================================");
    res.status(500).json({
      message: "Internal server error while fetching resource details",
      success: false,
    });
  }
};

const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, courseCode, detail, excerpt, labels } =
      req.body;

    const resource = await ResourceModel.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
        success: false,
      });
    }

    // Verify authorship
    if (resource.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to update this resource",
        success: false,
      });
    }

    // Parse labels
    let parsedLabels = resource.labels;

    if (labels) {
      parsedLabels =
        typeof labels === "string"
          ? labels
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : labels;
    }

    // Keep existing file information by default
    let fileUpdate = {};

    // If a new file is uploaded
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();

      const resourceType = [".jpg", ".jpeg", ".png", ".pdf"].includes(ext)
        ? "image"
        : "raw";

      console.log("Updating file:");
      console.log("Original name:", req.file.originalname);
      console.log("Size:", req.file.size);
      console.log("Resource type:", resourceType);

      // Upload new file to Cloudinary
      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
        resourceType
      );

      console.log("New file uploaded to Cloudinary:");
      console.log(uploadedFile);

      // Delete old file after successful upload
      if (resource.publicId) {
        await cloudinary.uploader.destroy(resource.publicId, {
          resource_type: resource.resourceType || "raw",
          type: "upload",
        });

        console.log("Old file deleted from Cloudinary");
      }

      // Store new Cloudinary information
      fileUpdate = {
        fileUrl: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        resourceType: uploadedFile.resource_type,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      };
    }

    const updatedResource = await ResourceModel.findByIdAndUpdate(
      id,
      {
        title: title || resource.title,
        department: department || resource.department,
        courseCode:
          courseCode === undefined
            ? resource.courseCode
            : courseCode.trim(),
        detail: detail || resource.detail,
        excerpt: excerpt || resource.excerpt,
        labels: parsedLabels,
        ...fileUpdate,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Resource updated successfully",
      success: true,
      resource: updatedResource,
    });
  } catch (err) {
    console.error("========== UPDATE RESOURCE ERROR ==========");
    console.dir(err, { depth: null });
    console.error("==========================================");

    res.status(500).json({
      message: "Internal server error while updating resource",
      success: false,
    });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await ResourceModel.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ message: "Resource not found", success: false });
    }

    // Verify authorship
    if (resource.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to delete this resource",
        success: false,
      });
    }

    // Delete file from disk
    if (resource.publicId) {
      await cloudinary.uploader.destroy(resource.publicId, {
        resource_type: resource.resourceType || "raw",
        type: "upload",
      });
    }

    await ResourceModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Resource deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("========== CREATE RESOURCE ERROR ==========");
    console.dir(err, { depth: null });

    if (err.response) {
      console.log("Response:");
      console.dir(err.response, { depth: null });
    }

    if (err.error) {
      console.log("Error:");
      console.dir(err.error, { depth: null });
    }

    console.error("==========================================");
    res.status(500).json({
      message: "Internal server error while deleting resource",
      success: false,
    });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
};
