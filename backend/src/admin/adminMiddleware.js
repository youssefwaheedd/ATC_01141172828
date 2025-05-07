import jwt from "jsonwebtoken";

// Middleware to ensure the user is an admin
export const isAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Token sent in the Authorization header

  if (!token) return res.status(403).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");

    // Now `user.isAdmin` will be properly available
    if (!user.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    req.user = user;
    next();
  });
};

export default isAdmin;
