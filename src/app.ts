import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { userRouter } from "./models/auth/auth.route";
import { bookingController } from "./models/bookings/booking.controller";
import { propertyController } from "./models/property/propery.controller";
import { propertyRouter } from "./models/property/property.route";
import { categoryRoutes } from "./models/category/category.route";
import { bookingRoute } from "./models/bookings/booking.route";
import { notFound } from "./midlewere/notFound";
import { globalErrorHandler } from "./midlewere/globalErrorHandler";

import { reviewRouter } from "./models/reviews/reviews.route";
import { paymentRouter } from "./models/payments/payments.route";
import { stripe } from "./lib/stripe";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// const endpointSecret = config.stripe_webhook_secret;

// app.post(
//   "/api/payments/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     let event = request.body;
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"]!;
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret,
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400);
//       }
//     }

//     console.log(event, "the event");

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`,
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case "payment_method.attached":
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   },
// );

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
app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
