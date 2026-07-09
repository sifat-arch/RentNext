import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../midlewere/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);

export const adminRoutr = router;
