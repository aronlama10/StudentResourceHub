const ResourceModel = require("../models/Resource");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const path = require("path");

const uploadToCloudinary = (buffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_chunked_stream(
      {
        folder: "StudentResourceHub",
        resource_type: resourceType,
        chunk_size: 6000000,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result && result.done === false) {
          // Intermediate chunk response — wait for the final response.
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
    const { title, department, semester, courseCode, detail, excerpt, labels } =
      req.body;
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
      semester: Number(semester),
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

    if (myUploads === "true" && req.user) {
      query.author = req.user._id;
    } else {
      query.status = "approved";
    }

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
    const { title, department, courseCode, detail, excerpt, labels } = req.body;

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
        resourceType,
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

    // Prepare the fields that will be updated
    const updateData = {
      title: title || resource.title,
      department: department || resource.department,
      courseCode:
        courseCode === undefined ? resource.courseCode : courseCode.trim(),
      detail: detail || resource.detail,
      excerpt: excerpt || resource.excerpt,
      labels: parsedLabels,
      ...fileUpdate,
    };

    // If the resource was previously rejected,
    // editing it means the student is resubmitting it.
    // Send it back to the pending moderation queue.
    if (resource.status === "rejected") {
      updateData.status = "pending";
      updateData.rejectionReason = "";
      updateData.reviewedBy = null;
      updateData.reviewedAt = null;
      updateData.isVerified = false;
      updateData.verificationNote = "";
    }

    const updatedResource = await ResourceModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
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

    // Delete file from cloudinary
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
    console.error("========== DELETE RESOURCE ERROR ==========");
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

const getPendingResources = async (req, res) => {
  try {
    const resources = await ResourceModel.find({
      status: "pending",
    })
      .populate("author", "name")
      .sort({ postedAt: -1 });

    const formattedResources = resources.map((resource) => {
      const doc = resource.toObject();

      return {
        ...doc,
        id: doc._id,
        author: doc.author ? doc.author.name : "Unknown User",
        authorId: doc.author ? doc.author._id : null,
      };
    });

    return res.status(200).json({
      success: true,
      resources: formattedResources,
    });
  } catch (err) {
    console.error("GET PENDING RESOURCES ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while fetching pending resources",
      success: false,
    });
  }
};

const getRejectedResources = async (req, res) => {
  try {
    const resources = await ResourceModel.find({
      status: "rejected",
    })
      .populate("author", "name")
      .populate("reviewedBy", "name")
      .sort({ reviewedAt: -1, postedAt: -1 });

    const formattedResources = resources.map((resource) => {
      const doc = resource.toObject();

      return {
        ...doc,
        id: doc._id,
        author: doc.author ? doc.author.name : "Unknown User",
        authorId: doc.author ? doc.author._id : null,
        reviewer: doc.reviewedBy ? doc.reviewedBy.name : "Unknown Reviewer",
      };
    });

    return res.status(200).json({
      success: true,
      resources: formattedResources,
    });
  } catch (err) {
    console.error("GET REJECTED RESOURCES ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while fetching rejected resources",
      success: false,
    });
  }
};

const getApprovedResources = async (req, res) => {
  try {
    const resources = await ResourceModel.find({
      status: "approved",
    })
      .populate("author", "name")
      .sort({ reviewedAt: -1, postedAt: -1 });

    const formattedResources = resources.map((resource) => {
      const doc = resource.toObject();

      return {
        ...doc,
        id: doc._id,
        author: doc.author ? doc.author.name : "Unknown User",
        authorId: doc.author ? doc.author._id : null,
      };
    });

    return res.status(200).json({
      success: true,
      resources: formattedResources,
    });
  } catch (err) {
    console.error("GET APPROVED RESOURCES ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while fetching approved resources",
      success: false,
    });
  }
};

const getArchivedResources = async (req, res) => {
  try {
    const resources = await ResourceModel.find({
      status: "archived",
    })
      .populate("author", "name")
      .sort({ reviewedAt: -1, postedAt: -1 });

    const formattedResources = resources.map((resource) => {
      const doc = resource.toObject();

      return {
        ...doc,
        id: doc._id,
        author: doc.author ? doc.author.name : "Unknown User",
        authorId: doc.author ? doc.author._id : null,
      };
    });

    return res.status(200).json({
      success: true,
      resources: formattedResources,
    });
  } catch (err) {
    console.error("GET ARCHIVED RESOURCES ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while fetching archived resources",
      success: false,
    });
  }
};

const approveResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await ResourceModel.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
        success: false,
      });
    }

    if (resource.status !== "pending") {
      return res.status(400).json({
        message: "Only pending resources can be approved",
        success: false,
      });
    }

    resource.status = "approved";
    resource.reviewedBy = req.user._id;
    resource.reviewedAt = new Date();
    resource.isVerified = true;
    resource.verificationNote = "Reviewed and approved by moderator.";

    await resource.save();

    return res.status(200).json({
      message: "Resource approved successfully",
      success: true,
      resource,
    });
  } catch (err) {
    console.error("APPROVE RESOURCE ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while approving resource",
      success: false,
    });
  }
};

const rejectResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        message: "Rejection reason is required",
        success: false,
      });
    }

    const resource = await ResourceModel.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
        success: false,
      });
    }

    if (resource.status !== "pending") {
      return res.status(400).json({
        message: "Only pending resources can be rejected",
        success: false,
      });
    }

    resource.status = "rejected";
    resource.rejectionReason = rejectionReason.trim();
    resource.reviewedBy = req.user._id;
    resource.reviewedAt = new Date();

    await resource.save();

    return res.status(200).json({
      message: "Resource rejected successfully",
      success: true,
      resource,
    });
  } catch (err) {
    console.error("REJECT RESOURCE ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while rejecting resource",
      success: false,
    });
  }
};

const archiveResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await ResourceModel.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
        success: false,
      });
    }

    if (resource.status !== "approved") {
      return res.status(400).json({
        message: "Only approved resources can be archived",
        success: false,
      });
    }

    resource.status = "archived";
    resource.isVerified = false;

    await resource.save();

    return res.status(200).json({
      message: "Resource archived successfully",
      success: true,
      resource,
    });
  } catch (err) {
    console.error("ARCHIVE RESOURCE ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while archiving resource",
      success: false,
    });
  }
};

const restoreResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await ResourceModel.findById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
        success: false,
      });
    }

    if (resource.status !== "archived") {
      return res.status(400).json({
        message: "Only archived resources can be restored",
        success: false,
      });
    }

    resource.status = "approved";

    // Keep it unverified until it is reviewed again.
    resource.isVerified = false;
    resource.verificationNote = "";

    await resource.save();

    return res.status(200).json({
      message: "Resource restored successfully",
      success: true,
      resource,
    });
  } catch (err) {
    console.error("RESTORE RESOURCE ERROR:", err);

    return res.status(500).json({
      message: "Internal server error while restoring resource",
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

  getPendingResources,
  getRejectedResources,
  getApprovedResources,
  getArchivedResources,

  approveResource,
  rejectResource,
  archiveResource,
  restoreResource,
};
