import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/register", userController.registerUser);

export const userRouter = router;
