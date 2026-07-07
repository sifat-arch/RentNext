import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { auth } from "../../midlewere/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.TENANT), reviewController.createReview);

router.get("", reviewController.getAllReviews);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.TENANT),
  reviewController.deleteReview,
);

export const reviewRouter = router;
