import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IBookingUpdate } from "../bookings/booking.interface";
import { IProperty, IPropertyUpdate } from "./proprty.interface";

const createPropertyIntoDB = async (landlordId: string, payload: IProperty) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: landlordId,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("You Dont have parmition to create proerty");
  }

  const properties = await prisma.property.create({
    data: {
      title: payload.title,
      location: payload.location,
      price: Number(payload.price),
      description: payload.description,
      landlordId: landlordId,
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
    },
  });

  return properties;
};

const getAllPorpertiesFromDB = async () => {
  const properties = await prisma.property.findMany({
    omit: {
      id: true,
      landlordId: true,
    },
    include: {
      reviews: true,
      category: {
        omit: {
          id: true,
        },
      },
    },
  });

  return properties;
};

const updatePropertiesIntoDB = async (
  id: string,
  payload: IPropertyUpdate,
  landloardId: string,
) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: landloardId,
    },
  });

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("You Dont have parmition to create proerty");
  }

  if (user.role !== Role.ADMIN && property.landlordId !== user.id) {
    throw new Error("Unauthorized");
  }
  const updateResult = await prisma.property.update({
    where: {
      id,
    },
    data: {
      title: payload.title,
      location: payload.location,
      price: Number(payload.price),
      description: payload.description,
    },
    omit: {
      id: true,
      landlordId: true,
    },
    include: {
      reviews: true,
      category: {
        omit: {
          id: true,
        },
      },
    },
  });

  return updateResult;
};

const deletePropertyFromDB = async (propertyId: string, landLordId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: landLordId,
    },
  });

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("You Dont have parmition to create proerty");
  }

  if (user.role !== Role.ADMIN && property.landlordId !== user.id) {
    throw new Error("Unauthorized");
  }
  await prisma.property.delete({
    where: {
      id: propertyId,
    },
    omit: {
      id: true,
      landlordId: true,
    },
    include: {
      reviews: true,
      category: {
        omit: {
          id: true,
        },
      },
    },
  });
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

export const propertyService = {
  createPropertyIntoDB,
  getAllPorpertiesFromDB,
  updatePropertiesIntoDB,
  deletePropertyFromDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingIntoDB,
  deleteBookingFromDB,
};
