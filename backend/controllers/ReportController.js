
const ReportModel = require("../models/Report");
const ResourceModel = require("../models/Resource");

const validCategories = [
  "Broken Link",
  "Duplicate Resource",
  "Incorrect Content",
  "Inappropriate Content",
  "Copyright Concern",
  "Other",
];

// Student submits a report.
const createReport = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { category, reason } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to report a resource.",
      });
    }

    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid report category.",
      });
    }

    if (
      typeof reason !== "string" ||
      !reason.trim() ||
      reason.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a reason of 1–1000 characters.",
      });
    }

    const resource = await ResourceModel.findById(resourceId);

    if (!resource || resource.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Approved resource not found.",
      });
    }

    if (resource.author.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot report your own resource.",
      });
    }

    const existingReport = await ReportModel.findOne({
      resource: resourceId,
      reporter: req.user._id,
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this resource.",
      });
    }

    const report = await ReportModel.create({
      resource: resourceId,
      reporter: req.user._id,
      category,
      reason: reason.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      report,
    });
  } catch (err) {
    // Handles duplicate submissions if requests arrive together.
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this resource.",
      });
    }

    console.error("CREATE REPORT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to submit the report.",
    });
  }
};

// Moderator/admin lists reports.
const getReports = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const allowedStatuses = ["pending", "resolved", "dismissed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status.",
      });
    }

    const reports = await ReportModel.find({ status })
      .populate("resource", "title department courseCode status fileUrl")
      .populate("reporter", "name")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (err) {
    console.error("GET REPORTS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reports.",
    });
  }
};

// Moderator/admin resolves or dismisses a report.
const reviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote = "" } = req.body;

    if (!["resolved", "dismissed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be resolved or dismissed.",
      });
    }

    if (
      typeof resolutionNote !== "string" ||
      resolutionNote.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Resolution note must be 1000 characters or fewer.",
      });
    }

    const report = await ReportModel.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    if (report.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This report has already been reviewed.",
      });
    }

    report.status = status;
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    report.resolutionNote = resolutionNote.trim();

    await report.save();

    return res.status(200).json({
      success: true,
      message: `Report ${status} successfully.`,
      report,
    });
  } catch (err) {
    console.error("REVIEW REPORT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to review the report.",
    });
  }
};

module.exports = {
  createReport,
  getReports,
  reviewReport,
};