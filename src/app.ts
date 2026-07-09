import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { userRouter } from "./models/auth/auth.route";

import { propertyRouter } from "./models/property/property.route";
import { categoryRoutes } from "./models/category/category.route";
import { bookingRoute } from "./models/bookings/booking.route";
import { notFound } from "./midlewere/notFound";
import { globalErrorHandler } from "./midlewere/globalErrorHandler";

import { reviewRouter } from "./models/reviews/reviews.route";
import { paymentRouter } from "./models/payments/payments.route";
import { adminRoutr } from "./models/admin/admin.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userRouter);
// app.use("/api/booking");
app.use("/api/property", propertyRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", bookingRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRoutr);
app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
