import userModel from "../models/user.model.js";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    return res.status(201).json({
      success: true,
      message: "Added to cart",
    });
  } catch (error) {
    console.error("Error adding food items to the cart:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// remove items from user cart

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] - +1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    return res.status(200).json({
      success: true,
      message: "Removed From Cart",
    });
  } catch (error) {
    console.error("Error removing food items from cart:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// fetch user cart data

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    return res.status(200).json({
      success: true,
      message: "Cart Data fetched successfully!",
      cartData,
    });
  } catch (error) {
    console.error("Error fetching user cart data :", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { addToCart, removeFromCart, getCart };
