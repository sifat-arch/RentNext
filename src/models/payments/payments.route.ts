import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../midlewere/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/checkout",
  auth(Role.TENANT, Role.ADMIN, Role.LANDLORD),
  paymentController.createCheckoutSession,
);

export const paymentRouter = router;
