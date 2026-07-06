import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createCategoryIntoDB = async (payload: ICategory) => {
  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const getSingleCategoryFromDB = async (id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
};
