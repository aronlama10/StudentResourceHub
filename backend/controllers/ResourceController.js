const ResourceModel = require("../models/Resource");
const fs = require("fs");
const path = require("path");

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

    const newResource = new ResourceModel({
      title,
      author: req.user._id, // Set by ensureAuthenticated middleware
      department,
      courseCode: normalizedCourseCode || "",
      detail,
      excerpt,
      labels: parsedLabels,
      filePath: req.file.path.replace(/\\/g, "/"), // Store with forward slashes
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    await newResource.save();

    res.status(201).json({
      message: "Resource uploaded successfully",
      success: true,
      resource: newResource,
    });
  } catch (err) {
    console.error("Create Resource Error: ", err);
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
    console.error("Get Resources Error: ", err);
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
    console.error("Get Resource By Id Error: ", err);
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
      return res
        .status(404)
        .json({ message: "Resource not found", success: false });
    }

    // Verify authorship
    if (resource.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
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

    // If new file is uploaded, remove old file and set new path
    let fileUpdate = {};
    if (req.file) {
      if (resource.filePath) {
        const oldFilePath = path.join(__dirname, "..", resource.filePath);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Error deleting old file: ", err);
        });
      }
      fileUpdate = {
        filePath: req.file.path.replace(/\\/g, "/"),
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
          courseCode === undefined ? resource.courseCode : courseCode.trim(),
        detail: detail || resource.detail,
        excerpt: excerpt || resource.excerpt,
        labels: parsedLabels,
        ...fileUpdate,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Resource updated successfully",
      success: true,
      resource: updatedResource,
    });
  } catch (err) {
    console.error("Update Resource Error: ", err);
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
      return res
        .status(403)
        .json({
          message: "Unauthorized to delete this resource",
          success: false,
        });
    }

    // Delete file from disk
    if (resource.filePath) {
      const filePathOnDisk = path.join(__dirname, "..", resource.filePath);
      fs.unlink(filePathOnDisk, (err) => {
        if (err) console.error("Error deleting file from disk: ", err);
      });
    }

    await ResourceModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Resource deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Delete Resource Error: ", err);
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
