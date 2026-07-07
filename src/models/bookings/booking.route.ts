import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";
import { auth } from "../../midlewere/auth";

const router = Router();

router.post("/", auth(Role.TENANT), bookingController.createBooking);

router.get("/", auth(Role.ADMIN), bookingController.getAllBookings);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.TENANT),
  bookingController.getSingleBooking,
);

router.patch("/:id", auth(Role.ADMIN), bookingController.updateBooking);

router.delete("/:id", auth(Role.ADMIN), bookingController.deleteBooking);

export const bookingRoute = router;
