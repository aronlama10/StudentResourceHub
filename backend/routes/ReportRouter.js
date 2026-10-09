
const router = require("express").Router();

const {
  createReport,
  getReports,
  reviewReport,
} = require("../controllers/ReportController");

const {
  ensureAuthenticated,
  requireRole,
} = require("../middlewares/Auth");

// Students submit reports.
router.post(
  "/:resourceId",
  ensureAuthenticated,
  createReport
);

// Moderators/admins manage reports.
router.get(
  "/",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  getReports
);

router.patch(
  "/:id/review",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  reviewReport
);

module.exports = router;