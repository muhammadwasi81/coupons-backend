import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import authRoutes from "./routes/userRouter.js";
import couponRoutes from "./routes/couponsRouter.js";

dotenv.config();
const port = process.env.PORT || 8080;

connectDB();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/user", authRoutes);
app.use("/api/coupon", couponRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () =>
  console.log(`Server started on port ${port}`.yellow.bold)
);
