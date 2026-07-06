import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { LoginUserPayload, RegisterUserPayload } from "./auth.interface";
import config from "../config";
import jwt, { SignOptions } from "jsonwebtoken";

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

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  // accesstoen generate

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwt_access_secret,
    {
      expiresIn: config.jwt_access_expires_in,
    } as SignOptions,
  );
  // refresh token generate
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwt_refresh_secret,
    {
      expiresIn: config.jwt_refresh_expires_in,
    } as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const userService = {
  registerUserDB,
  loginUserDB,
};
