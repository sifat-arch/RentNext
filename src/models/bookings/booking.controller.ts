import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const landLordId = req.user?.id;

  const result = await bookingService.createBookingIntoDB(landLordId as string);
});

export const bookingController = {
  createBooking,
};
