import { Router } from "express";
import { aiController } from "./ai.controller";

const router = Router();

router.post("/chat", aiController.chat);
router.post("/generate-listing", aiController.generateListing);
router.post("/smart-search", aiController.smartSearch);

export const aiRouter = router;
