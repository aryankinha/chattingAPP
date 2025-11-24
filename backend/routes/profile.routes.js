import express from "express";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";
import { updateAvatar, changePassword } from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/avatar", authenticate, upload.single("avatar"), updateAvatar);
router.post("/change-password", authenticate, changePassword);

export default router;
