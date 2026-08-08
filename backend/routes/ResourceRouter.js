const router = require("express").Router();
const ensureAuthenticated = require("../middlewares/Auth");
const upload = require("../middlewares/Upload");
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
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

// Public/Semi-protected routes
router.get("/", optionalAuthenticate, getResources);
router.get("/:id", getResourceById);

// Protected routes (require valid JWT)
router.post("/", ensureAuthenticated, upload.single("file"), createResource);
router.put("/:id", ensureAuthenticated, upload.single("file"), updateResource);
router.delete("/:id", ensureAuthenticated, deleteResource);

module.exports = router;
