import { Router } from "express";
import { propertyController } from "./propery.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../midlewere/auth";

const router = Router();

router.post(
  "/properties",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.createProperty,
);
router.get("/properties", propertyController.getAllProperties);
router.put(
  "/properties/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.updateProperties,
);
router.delete(
  "/properties/:id",
  auth(Role.ADMIN, Role.LANDLORD),
  propertyController.deleteProperty,
);

export const propertyRouter = router;
