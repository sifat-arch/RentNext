import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import { sendResponse } from "../../utils/sendResponce";
import httpStatus from "http-status";

const createBooking = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await bookingService.createBookingIntoDB(
    req.user!.id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
};
