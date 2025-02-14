import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export default authMiddleware;
