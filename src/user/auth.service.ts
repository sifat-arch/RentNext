import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { LoginUserPayload, RegisterUserPayload } from "./auth.interface";
import config from "../config";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../utils/jwt";

const registerUserDB = async (payload: RegisterUserPayload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.byrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const loginUserDB = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("Your account has been banned. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwtUtils.createToken(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"],
  );

  const refreshToken = jwtUtils.createToken(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions["expiresIn"],
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMeDB = async (userId: string) => {
  const user = prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const refreshTokenDB = async (refreshToken: string) => {
  const verifiedRefreshtoken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshtoken.success) {
    throw new Error(verifiedRefreshtoken.error);
  }

  const { id } = verifiedRefreshtoken.data as JwtPayload;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("User is Blocked");
  }

  const jwtpayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"],
  );

  return {
    accessToken,
  };
};

export const userService = {
  registerUserDB,
  loginUserDB,
  getMeDB,
  refreshTokenDB,
};
