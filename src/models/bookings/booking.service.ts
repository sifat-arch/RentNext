import { prisma } from "../../lib/prisma";

const createBookingIntoDB = async (landlordId: string) => {
  const properties = await prisma.property;
};

export const bookingService = {
  createBookingIntoDB,
};
