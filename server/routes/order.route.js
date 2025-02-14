import express from "express";
import {
  placeOrder,
  verifyOrder,
  userOrder,
  listorders,
  updateStatus,
} from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.route("/place").post(authMiddleware, placeOrder);
orderRouter.route("/verify").post(authMiddleware, verifyOrder);
orderRouter.route("/userorders").post(authMiddleware, userOrder);
orderRouter.route("/list").get(listorders);
orderRouter.route("/status").post(updateStatus);

export default orderRouter;
