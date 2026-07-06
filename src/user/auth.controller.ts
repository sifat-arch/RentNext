import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import { userService } from "./auth.service";
import { sendResponse } from "../utils/sendResponce";
import config from "../config";
import { jwtUtils } from "../utils/jwt";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await userService.registerUserDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: result,
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } =
      await userService.loginUserDB(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    // const verifyToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );

    // if (typeof verifyToken === "string") {
    //   throw new Error("Invalid token payload");
    // }

    const profile = await userService.getMeDB(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile retrieved successfully",
      data: profile,
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await userService.refreshTokenDB(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Token Refreshed successfully",
      data: {
        accessToken,
      },
    });
  },
);

export const userController = {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
};
