import { prisma } from "../../lib/prisma";

const createCheckoutSessionIntoDB = async (usreId: string) => {
  const trensitionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: {
        id: usreId,
      },
      include: {
        payments: true,
      },
    });
  });
};

export const paymentService = {
  createCheckoutSessionIntoDB,
};
