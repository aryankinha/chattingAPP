import React from "react";
import { MessageSquare, Users, Globe, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../api/axios";

const ChatSidebar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await LogoutUser();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  return (
    <aside className="flex h-screen flex-col justify-between bg-background-dark w-64 p-6 sticky top-0">

      {/* TOP SECTION */}
      <div className="flex flex-col gap-10">

        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <MessageSquare size={32} className="text-primary" />
          <h1 className="text-text-primary-light text-2xl font-bold">
            Connect
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-4">

          {/* CHATS */}
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all 
              ${
                activeTab === "chat"
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-text-secondary-light hover:bg-white/10"
              }`}
          >
            <MessageSquare size={22} />
            <span className="text-base">Chats</span>
          </button>

          {/* FRIENDS — optional for future */}
          <button
            onClick={() => onTabChange("friends")}
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all 
              ${
                activeTab === "friends"
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-text-secondary-light hover:bg-white/10"
              }`}
          >
            <Users size={22} />
            <span className="text-base">Friends</span>
          </button>

          {/* GLOBAL */}
          <button
            onClick={() => onTabChange("global")}
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all 
              ${
                activeTab === "global"
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-text-secondary-light hover:bg-white/10"
              }`}
          >
            <Globe size={22} />
            <span className="text-base">Global</span>
          </button>
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col gap-6">

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-full text-text-secondary-light hover:bg-white/10 transition-all"
        >
          <LogOut size={20} />
          <span className="text-base font-medium">Logout</span>
        </button>

        {/* USER PROFILE */}
        <button
          onClick={() => onTabChange("profile")}
          className="flex items-center gap-3 rounded-full px-2 py-2 transition-all
             hover:bg-white/10 hover:scale-[1.02]"
        >
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-accent-secondary flex items-center justify-center text-white font-bold overflow-hidden border-2 border-accent-tertiary shadow-md">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{getInitials(user.name || "User")}</span>
              )}
            </div>

            {/* Online Indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background-dark"></div>
          </div>

          <div className="flex flex-col">
            <p className="text-text-primary-light font-semibold">
              {user.name || "Alex Doe"}
            </p>
            <p className="text-text-secondary-light text-sm">Online</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
