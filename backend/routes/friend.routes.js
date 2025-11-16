import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  getFriends
} from "../controllers/friend.controller.js";

import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// All routes need authentication
router.use(authenticate);

// Send request
router.post("/request", sendFriendRequest);

// Accept request
router.post("/accept", acceptFriendRequest);

// Pending requests (for logged-in user)
router.get("/pending", getPendingRequests);

// List of accepted friends
router.get("/list", getFriends);

export default router;
