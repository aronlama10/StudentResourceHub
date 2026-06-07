const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.get("authorization");
  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is require" });
  }

  // header commonly in form: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is require" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};

module.exports = ensureAuthenticated;
