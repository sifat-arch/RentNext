import { prisma } from "../../lib/prisma";
import { IReview } from "./reviews.interface";

const createReviewIntoDB = async (userId: string, payload: IReview) => {
  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      propertyId: payload.propertyId,
      userId,
    },
    include: {
      user: true,
      property: true,
    },
  });

  return result;
};

const getAllReviewsFromDB = async () => {
  return await prisma.review.findMany({
    include: {
      user: true,
      property: true,
    },
  });
};

const deleteReviewFromDB = async (id: string) => {
  return await prisma.review.delete({
    where: {
      id,
    },
  });
};

export const reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  deleteReviewFromDB,
};
