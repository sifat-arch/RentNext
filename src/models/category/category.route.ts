import { Router } from "express";
import { categoryController } from "./categroy.controller";
import { auth } from "../../midlewere/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getSingleCategory);

export const categoryRoutes = router;
