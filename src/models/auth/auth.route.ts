import { Router } from "express";
import { userController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../midlewere/auth";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getMe,
);

router.post("/refresh-token", userController.refreshToken);

export const userRouter = router;
