import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Route imports
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import UserModel from "./models/userModel.js"; // Optional: Only if you want to test users

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Credentials
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpass = encodeURIComponent(process.env.DBPASS);

// Connect to MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://${dbuser}:${dbpass}@cluster0.yjvljwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "MongoDB is connected ✅" });
});

// Optional: List first 5 users for testing
app.get("/check-users", async (req, res) => {
  try {
    const users = await UserModel.find().limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
