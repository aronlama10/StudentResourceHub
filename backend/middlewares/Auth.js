const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.get("authorization");

  if (!authHeader) {
    return res.status(403).json({
      message: "Unauthorized, JWT token is required",
    });
  }

  // Header commonly comes in the form: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(403).json({
      message: "Unauthorized, JWT token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized, JWT token is wrong or expired",
    });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission.",
      });
    }

    return next();
  };
};

module.exports = {
  ensureAuthenticated,
  requireRole,
};
