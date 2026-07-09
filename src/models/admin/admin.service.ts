import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();

  return result;
};

const changeUserStatus = async (userId: string, status: string) => {
  if (!["ACTIVE", "BANNED"].includes(status)) {
    throw new Error("Invalid status. Use 'active' or 'banned'.");
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: status as UserStatus,
    },
  });

  return user;
};

export const adminServices = {
  getAllUsersFromDB,
  changeUserStatus,
};
