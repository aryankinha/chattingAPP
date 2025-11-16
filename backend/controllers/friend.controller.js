import Friendship from "../model/friend.model.js";
import User from "../model/user.model.js";


export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    // Cannot add yourself
    if (requesterId === recipientId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    // Check if already friends or pending
    const existing = await Friendship.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

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
    const userId = req.user.id; // the recipient
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

    return res.json({
      message: "Friend request accepted",
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
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    });

    // Determine all friend IDs
    const friendIds = friendships.map((fr) =>
      fr.requester.toString() === userId ? fr.recipient : fr.requester
    );

    // Fetch friend details
    const friends = await User.find({ _id: { $in: friendIds } })
      .select("name email avatar status lastSeen");

    return res.json({ friends });
  } catch (err) {
    console.error("Get Friend List Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
