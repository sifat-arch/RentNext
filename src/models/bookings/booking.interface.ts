import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBooking {
  propertyId: string;
}

export interface IBookingUpdate {
  status?: BookingStatus;
}
