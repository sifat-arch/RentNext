import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IBooking, IBookingQuery, IBookingUpdate } from "./booking.interface";

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

const getAllBookingsFromDB = async (query: IBookingQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;

  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  return await prisma.booking.findMany({
    where: {
      AND: [
        query.search
          ? {
              OR: [
                {
                  user: {
                    name: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  property: {
                    title: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {},
      ],
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

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

const getLandlordBookingsFromDB = async (landlordId: string) => {
  return await prisma.booking.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      user: true,
      property: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateBookingStatusIntoDB = async (
  bookingId: string,
  landlordId: string,
  status: BookingStatus,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      property: true,
    },
  });

  if (booking.property.landlordId !== landlordId) {
    throw new Error("Unauthorized");
  }

  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
    include: {
      user: true,
      property: true,
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
  updateBookingStatusIntoDB,
  getLandlordBookingsFromDB,
};
