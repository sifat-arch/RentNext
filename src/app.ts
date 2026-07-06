import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { userRouter } from "./models/auth/auth.route";
import { bookingController } from "./models/bookings/booking.controller";
import { propertyController } from "./models/property/propery.controller";
import { propertyRouter } from "./models/property/property.route";
import { categoryRoutes } from "./models/category/category.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userRouter);
// app.use("/api/booking");
app.use("/api/property", propertyRouter);
app.use("/api/categories", categoryRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

export default app;
