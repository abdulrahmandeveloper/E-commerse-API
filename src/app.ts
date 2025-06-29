import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "@/routes/userRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import categoryRoutes from "@/routes/categoryRoutes.js";
import cartRouter from "@/routes/cartRoutes.js";
import reviewRoutes from "@/routes/reviewRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/products/review", reviewRoutes);

//for checking only -test
app.get("/check", (req, res) => {
  res.json({
    status: "OK",
    message: " running",
  });
});

export default app;
