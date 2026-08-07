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
      "CS & IT",
      "Architecture Engineering",
    ],
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
});

module.exports = mongoose.model("resources", ResourceSchema);
