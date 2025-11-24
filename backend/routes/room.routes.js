import express from "express";
import authenticate from "../middleware/authenticate.js";
import { getMyRooms, getOrCreateRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/my", authenticate, getMyRooms);
router.get("/with/:friendId", authenticate, getOrCreateRoom);

export default router;
