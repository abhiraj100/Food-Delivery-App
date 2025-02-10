import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import foodRouter from "./routes/food.route.js";

// app config
const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// API endpoints

app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));

// app.get("/", (req, res) => {
//   res.send("API working");
// });

app.listen(PORT, () => {
  console.log(`Server Started on : http://localhost${PORT}`);
});
