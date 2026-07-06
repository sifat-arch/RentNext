import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponce";

import httpstatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.createCategoryIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Category created successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getSingleCategoryFromDB(
      req.params.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
};
