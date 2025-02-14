import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while placing order",
    });
  }
};

// verify order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    console.log("Verifying order:", { orderId, success });

    // Convert success to a boolean if it's a string
    const isSuccess = success === true || success === "true";

    if (isSuccess) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// user orders for frontend

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Listing orders for admin panel
const listorders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// API for updating order status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status: status });
    return res.status(200).json({
      success: true,
      message: "Status Updated",
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export { placeOrder, verifyOrder, userOrder, listorders, updateStatus };
