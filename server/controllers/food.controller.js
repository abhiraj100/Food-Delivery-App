import foodModel from "../models/food.model.js";
import fs from "fs";

// API to add food item

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { name, description, price, category } = req.body;
    const image_filename = `${req.file.filename}`;

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: image_filename,
    });

    await food.save(); // Save food item to database

    return res
      .status(201)
      .json({ success: true, message: "Food item added successfully", food });
  } catch (error) {
    console.error("Error adding food item:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// API to display all the food items in the database

const getAllFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    if (!foods) {
      return res.status(400).json({
        success: false,
        message: "Food not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Food Retrieved",
        data: foods,
      });
    }
  } catch (error) {
    console.error("Error displaying food items list:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// API to remove food item
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;
    const food = await foodModel.findById(id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(id);

    if (food) {
      return res.status(200).json({
        success: true,
        message: "Food Deleted Successfully",
        data: food,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Food Not Found",
      });
    }
  } catch (error) {
    console.error("Error while removing food items :", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { addFood, getAllFood, removeFood };
