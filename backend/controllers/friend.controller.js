import Friendship from "../model/friend.model.js";
import User from "../model/user.model.js";
import createOrGetRoom  from "../utils/createOrGetRoom.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const requesterId = req.user.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    if (requesterId === recipientId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    // Check if already friends or pending
    const existing = await Friendship.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    // If already friends
    if (existing && existing.status === "accepted") {
      return res.status(400).json({ message: "You are already friends" });
    }

    // If request already pending
    if (existing && existing.status === "pending") {
      return res
        .status(400)
        .json({ message: "Friend request already pending" });
    }

    // If rejected → allow new request (delete old)
    if (existing && existing.status === "rejected") {
      await existing.deleteOne();
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    // Notify recipient if online
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("friend-request-received", {
        friendshipId: friendship._id,
        requesterId,
      });
    }

    return res.status(201).json({
      message: "Friend request sent",
      friendship,
    });
  } catch (err) {
    console.error("Send Friend Request Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const userId = req.user.id; 
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ message: "Requester ID is required" });
    }

    const friendship = await Friendship.findOneAndUpdate(
      {
        requester: requesterId,
        recipient: userId,
        status: "pending",
      },
      { status: "accepted" },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }


    const room = await createOrGetRoom(userId, requesterId);


    const requesterSocketId = onlineUsers.get(requesterId);
    if (requesterSocketId) {
      io.to(requesterSocketId).emit("friend-request-accepted", {
        by: userId,
        roomId: room._id
      });
    }

    return res.json({
      message: "Friend request accepted",
      roomId: room._id,
      friendship,
    });
  } catch (err) {
    console.error("Accept Friend Request Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Friendship.find({
      recipient: userId,
      status: "pending",
    })
      .populate("requester", "name email avatar status")
      .sort({ createdAt: -1 });

    return res.json({ requests });
  } catch (err) {
    console.error("Get Pending Requests Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friendships = await Friendship.find({
      status: "accepted",
      $or: [{ requester: userId }, { recipient: userId }],
    });

    // Determine all friend IDs
    const friendIds = friendships.map((fr) =>
      fr.requester.toString() === userId ? fr.recipient : fr.requester
    );

    // Fetch friend details
    const friends = await User.find({ _id: { $in: friendIds } }).select(
      "name email avatar status lastSeen"
    );

    return res.json({ friends });
  } catch (err) {
    console.error("Get Friend List Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ message: "Requester ID is required" });
    }

    const friendship = await Friendship.findOneAndUpdate(
      {
        requester: requesterId,
        recipient: userId,
        status: "pending",
      },
      { status: "rejected" },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    return res.json({
      message: "Friend request rejected",
      friendship,
    });
  } catch (err) {
    console.error("Reject Friend Request Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    const friendship = await Friendship.findOneAndDelete({
      status: "accepted",
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    return res.json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Remove Friend Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRejectedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Friendship.find({
      recipient: userId,
      status: "rejected",
    })
      .populate("requester", "name email avatar status")
      .sort({ updatedAt: -1 });

    return res.json({ requests });
  } catch (err) {
    console.error("Get Rejected Requests Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
