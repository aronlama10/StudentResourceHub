const router = require("express").Router();
const ensureAuthenticated = require("../middlewares/Auth");
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

module.exports = router;
