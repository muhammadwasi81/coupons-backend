import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import authRoutes from "./routes/userRouter.js";
import couponRoutes from "./routes/couponsRouter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();
const port = process.env.PORT || 8080;

connectDB();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.use("/images", express.static(imagesDir));

app.use("/api/user", authRoutes);
app.use("/api/coupon", couponRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () =>
  console.log(`Server started on port ${port}`.yellow.bold)
);
