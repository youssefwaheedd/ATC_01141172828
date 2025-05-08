import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(403).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");

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
