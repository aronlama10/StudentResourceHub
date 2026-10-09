const router = require("express").Router();
const { ensureAuthenticated, requireRole } = require("../middlewares/Auth");
const {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
  toggleSaveResource,
  getSavedResources,
  checkSavedStatus,
  trackStudyStreak,
} = require("../controllers/UserController");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/AdminUserController");

router.get("/profile", ensureAuthenticated, getProfile);
router.put("/profile", ensureAuthenticated, updateProfile);
router.put("/profile/email", ensureAuthenticated, updateEmail);
router.put("/profile/password", ensureAuthenticated, updatePassword);

// Saved resources routes
router.get("/saved/status", ensureAuthenticated, checkSavedStatus);
router.get("/saved", ensureAuthenticated, getSavedResources);
router.post("/saved/:resourceId", ensureAuthenticated, toggleSaveResource);

// Study streak routes
router.post("/streak", ensureAuthenticated, trackStudyStreak);

// Admin-only user management
router.get("/admin", ensureAuthenticated, requireRole("admin"), getAllUsers);

router.patch(
  "/admin/:id/role",
  ensureAuthenticated,
  requireRole("admin"),
  updateUserRole,
);

router.delete(
  "/admin/:id",
  ensureAuthenticated,
  requireRole("admin"),
  deleteUser,
);

module.exports = router;
