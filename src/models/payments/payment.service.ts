import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSessionIntoDB = async (
  userId: string,
  bookingId: string,
) => {
  const trensitionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
      include: {
        property: true,
      },
    });

    if (booking.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (booking.status !== BookingStatus.APPROVED) {
      throw new Error("Booking is not approved.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",

            unit_amount: booking.property.price * 100,

            product_data: {
              name: booking.property.title,
              description: booking.property.description,
            },
          },
        },
      ],

      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
      },

      success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.client_url}/payment/cancel`,
    });

    return session.url;
  });

  return trensitionResult;
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // const paymentIntent = event.data.object;
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId as string;
      const userId = session.metadata?.userId as string;

      console.log(session);
      console.log(session.metadata);

      if (session.payment_status !== "paid") {
        throw new Error("Payment failed.");
      }
      if (!bookingId || !userId) {
        throw new Error("Invalid metadata");
      }

      await prisma.$transaction(async (tx) => {
        const existingPayment = await tx.payment.findUnique({
          where: {
            bookingId,
          },
        });

        if (existingPayment) {
          return;
        }
        await tx.payment.create({
          data: {
            bookingId,
            userId,
            amount: (session.amount_total ?? 0) / 100,
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.SUCCESS,
            transactionId: session.payment_intent as string,
          },
        });

        await tx.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: BookingStatus.PAID,
          },
        });
      });

      break;

    default:
      // Unexpected event type
      console.log(`No Events Matched ${event.type}.`);
      break;
  }
};

export const paymentService = {
  createCheckoutSessionIntoDB,
  handleWebhook,
};
