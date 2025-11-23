import express from "express";
import authenticate from "../middleware/authenticate.js";
import { getMyRooms } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/my", authenticate, getMyRooms);

export default router;
