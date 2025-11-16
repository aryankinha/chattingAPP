import express from "express";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
  });
});

export default router;
