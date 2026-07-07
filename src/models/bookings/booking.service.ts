import { prisma } from "../../lib/prisma";
import { IBooking, IBookingUpdate } from "./booking.interface";

const createBookingIntoDB = async (userId: string, payload: IBooking) => {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      propertyId: payload.propertyId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  if (existingBooking) {
    throw new Error("You have already booked this property.");
  }
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

const getAllBookingsFromDB = async () => {
  return await prisma.booking.findMany({
    include: {
      property: true,
      user: true,
      payment: true,
    },
  });
};

const getSingleBookingFromDB = async (id: string) => {
  return await prisma.booking.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      property: true,
      user: true,
      payment: true,
    },
  });
};

const updateBookingIntoDB = async (id: string, payload: IBookingUpdate) => {
  return await prisma.booking.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
    include: {
      property: true,
      user: true,
      payment: true,
    },
  });
};

const deleteBookingFromDB = async (id: string) => {
  return await prisma.booking.delete({
    where: {
      id,
    },
  });
};
export const bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingIntoDB,
  deleteBookingFromDB,
};
