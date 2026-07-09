import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponce";
import httpstatus from "http-status";
import { adminServices } from "./admin.service";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminServices.getAllUsersFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Retrive All Users Successfully",
      data: result,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await adminServices.changeUserStatus(id as string, status);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: `Change the user Status as ${result.status}`,
      data: result,
    });
  },
);

export const adminController = { getAllUsers, updateUserStatus };
