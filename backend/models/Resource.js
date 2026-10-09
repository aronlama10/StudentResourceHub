const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users", // Reference to the User model
    required: true,
  },

  department: {
    type: String,
    required: true,
    enum: [
      "Computer Engineering",
      "Civil Engineering",
      "Architecture Engineering",
      "Electrical & Electronics Engineering",
    ],
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6],
  },
  courseCode: {
    type: String,
    trim: true,
    default: "",
  },
  detail: {
    type: String, // e.g. "45 pages · PDF"
    required: true,
  },
  excerpt: {
    type: String,
    trim: true,
  },
  labels: {
    type: [String], // Array of strings e.g. ["Notes", "Exam Prep"]
    default: [],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
  },
  fileName: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "reported", "archived"],
    default: "pending",
  },

  rejectionReason: {
    type: String,
    default: "",
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

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationNote: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("resources", ResourceSchema);
