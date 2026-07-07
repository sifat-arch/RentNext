import { prisma } from "../../lib/prisma";
import { IBooking } from "./booking.interface";

const createBookingIntoDB = async (userId: string, payload: IBooking) => {
  const result = await prisma.booking.create({
    data: {
      userId,
      propertyId: payload.propertyId,
    },
    include: {
      property: true,
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};
export const bookingService = {
  createBookingIntoDB,
};
