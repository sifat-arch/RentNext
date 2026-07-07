import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBooking {
  propertyId: string;
}

export interface IBookingUpdate {
  status?: BookingStatus;
}

export interface IBookingQuery {
  search?: string;

  sortBy?: "createdAt" | "status";
  sortOrder?: "asc" | "desc";

  page?: string;
  limit?: string;
}
