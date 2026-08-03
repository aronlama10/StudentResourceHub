const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

const getDateKey = (date = new Date()) => {
  const localDate = new Date(date);
  const offset = localDate.getTimezoneOffset() * 60000;
  return new Date(localDate.getTime() - offset).toISOString().slice(0, 10);
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get Profile Error: ", err);
    res.status(500).json({
      message: "Internal server error while fetching profile",
      success: false,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, department, year, notificationsEnabled, profilePrivacy } =
      req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name,
        department,
        year,
        notificationsEnabled,
        profilePrivacy,
      },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error: ", err);
    res.status(500).json({
      message: "Internal server error while updating profile",
      success: false,
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (existingUser._id.toString() === req.user._id.toString()) {
        return res
          .status(200)
          .json({ message: "Email is already set to this", success: true });
      }
      return res.status(409).json({
        message: "Email is already in use by another user",
        success: false,
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { email },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Email updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Email Error: ", err);
    res.status(500).json({
      message: "Internal server error while updating email",
      success: false,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new passwords are required",
        success: false,
      });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect current password", success: false });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Update Password Error: ", err);
    res.status(500).json({
      message: "Internal server error while updating password",
      success: false,
    });
  }
};

const toggleSaveResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const index = user.savedResources.indexOf(resourceId);
    let saved;
    if (index === -1) {
      // Add to saved
      user.savedResources.push(resourceId);
      saved = true;
    } else {
      // Remove from saved
      user.savedResources.splice(index, 1);
      saved = false;
    }
    await user.save();

    res.status(200).json({
      success: true,
      saved,
      message: saved ? "Resource saved!" : "Resource unsaved.",
      savedResources: user.savedResources,
    });
  } catch (err) {
    console.error("Toggle Save Resource Error: ", err);
    res.status(500).json({
      message: "Internal server error while toggling saved resource",
      success: false,
    });
  }
};

const getSavedResources = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "savedResources",
      populate: {
        path: "author",
        select: "name email",
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Format resources the same way as ResourceController.getResources
    const formattedResources = user.savedResources
      .filter((resource) => resource !== null) // Filter out deleted resources
      .map((resource) => {
        const doc = resource.toObject ? resource.toObject() : resource;
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
    console.error("Get Saved Resources Error: ", err);
    res.status(500).json({
      message: "Internal server error while fetching saved resources",
      success: false,
    });
  }
};

const checkSavedStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      "savedResources",
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      success: true,
      savedResourceIds: user.savedResources,
    });
  } catch (err) {
    console.error("Check Saved Status Error: ", err);
    res.status(500).json({
      message: "Internal server error while checking saved status",
      success: false,
    });
  }
};

const trackStudyStreak = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const today = getDateKey();
    const lastActivity = user.lastStudyActivityDate
      ? getDateKey(user.lastStudyActivityDate)
      : null;
    let streak = Number(user.studyStreak || 0);

    if (!lastActivity) {
      streak = 1;
    } else if (lastActivity === today) {
      streak = streak;
    } else {
      const yesterday = getDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
      if (lastActivity === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
    }

    user.studyStreak = streak;
    user.lastStudyActivityDate = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      streak,
      lastStudyActivityDate: user.lastStudyActivityDate,
      message: "Study streak updated",
    });
  } catch (err) {
    console.error("Track Study Streak Error: ", err);
    res.status(500).json({
      message: "Internal server error while updating study streak",
      success: false,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
  toggleSaveResource,
  getSavedResources,
  checkSavedStatus,
  trackStudyStreak,
};
