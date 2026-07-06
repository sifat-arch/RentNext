import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
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

export const propertyService = {
  createPropertyIntoDB,
  getAllPorpertiesFromDB,
  updatePropertiesIntoDB,
  deletePropertyFromDB,
};
