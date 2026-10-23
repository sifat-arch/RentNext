import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponce";
import httpStatus from "http-status";
import { aiService } from "./ai.service";

const chat = catchAsync(async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "A valid 'message' string is required",
      data: null,
    });
  }

  const result = await aiService.chatAssistant(message, history || []);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "AI response generated successfully",
    data: result,
  });
});

const generateListing = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await aiService.generateListing(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Listing generated successfully",
    data: result,
  });
});

const smartSearch = catchAsync(async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "A valid 'query' string is required",
      data: null,
    });
  }

  const result = await aiService.smartSearch(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Smart search matches found",
    data: result,
  });
});

export const aiController = {
  chat,
  generateListing,
  smartSearch,
};
