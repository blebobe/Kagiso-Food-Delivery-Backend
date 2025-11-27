import express from "express";
import { getReleaseForIdentifier } from "../controllers/releaseController.js";
const router = express.Router();
router.get("/", getReleaseForIdentifier);
export default router;
