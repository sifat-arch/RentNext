import { BookingStatus } from "../../../generated/prisma/enums";
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
        booking: booking.id,
        userId: booking.userId,
      },

      success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.client_url}/payment/cancel`,
    });

    return session.url;
  });

  return trensitionResult;
};

export const paymentService = {
  createCheckoutSessionIntoDB,
};
