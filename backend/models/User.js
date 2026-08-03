const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: "",
  },
  year: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  profilePrivacy: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  studyStreak: {
    type: Number,
    default: 0,
  },
  lastStudyActivityDate: {
    type: Date,
    default: null,
  },
  savedResources: {
    type: [{ type: Schema.Types.ObjectId, ref: "resources" }],
    default: [],
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
