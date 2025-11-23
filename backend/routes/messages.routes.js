import express from "express";
import { getMessages, sendMessage } from "../controllers/messages.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/:roomId", authenticate, getMessages);

router.post("/", authenticate, sendMessage);

export default router;