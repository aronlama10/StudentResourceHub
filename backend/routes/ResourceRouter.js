const router = require("express").Router();
const { ensureAuthenticated, requireRole } = require("../middlewares/Auth");
const upload = require("../middlewares/Upload");
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,

  getPendingResources,
  getRejectedResources,
  getApprovedResources,
  getArchivedResources,

  approveResource,
  rejectResource,
  archiveResource,
  restoreResource,
} = require("../controllers/ResourceController");

// Helper middleware to handle JWT optionally for public routes that might need req.user
const jwt = require("jsonwebtoken");
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.get("authorization");
  if (!authHeader) return next();

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Soft fail
  }
  next();
};

// Moderator/Admin moderation routes
router.get(
  "/pending",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  getPendingResources,
);

router.get(
  "/admin/approved",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  getApprovedResources,
);

router.get(
  "/admin/rejected",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  getRejectedResources,
);

router.get(
  "/admin/archived",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  getArchivedResources,
);

router.patch(
  "/:id/approve",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  approveResource,
);

router.patch(
  "/:id/reject",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  rejectResource,
);

router.patch(
  "/:id/archive",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  archiveResource,
);

router.patch(
  "/:id/restore",
  ensureAuthenticated,
  requireRole("moderator", "admin"),
  restoreResource,
);

// Public/Semi-protected routes
router.get("/", optionalAuthenticate, getResources);
router.get("/:id", getResourceById);

// Protected routes (require valid JWT)
router.post(
  "/",
  ensureAuthenticated,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File is too large. Maximum file size is 10 MB.",
            success: false,
          });
        }

        return res.status(400).json({
          message: err.message || "File upload failed",
          success: false,
        });
      }

      next();
    });
  },
  createResource,
);
router.put("/:id", ensureAuthenticated, upload.single("file"), updateResource);
router.delete("/:id", ensureAuthenticated, deleteResource);

module.exports = router;
