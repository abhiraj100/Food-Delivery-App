import express from "express";
import cors from "cors";
// import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import foodRouter from "./routes/food.route.js";
import userRouter from "./routes/user.route.js";
import options from "./config/config.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

// app config
const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors(options));

// db connection
connectDB();

// API endpoints

app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// app.get("/", (req, res) => {
//   res.send("API working");
// });

app.listen(PORT, () => {
  console.log(`Server Started on : http://localhost${PORT}`);
});
