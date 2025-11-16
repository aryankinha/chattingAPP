import User from "../model/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;


    const users = await User.find(
      { _id: { $ne: currentUserId } }, // Exclude current user
      { password: 0, refreshToken: 0 }
    )
      .sort({ name: 1 }) // Sort alphabetically by name
      .lean();

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
