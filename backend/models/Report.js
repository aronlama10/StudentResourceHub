
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: "resources",
      required: true,
    },

    reporter: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Broken Link",
        "Duplicate Resource",
        "Incorrect Content",
        "Inappropriate Content",
        "Copyright Concern",
        "Other",
      ],
    },

    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    resolutionNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from reporting the same resource
// more than once.
ReportSchema.index(
  { resource: 1, reporter: 1 },
  { unique: true }
);

module.exports = mongoose.model("reports", ReportSchema);