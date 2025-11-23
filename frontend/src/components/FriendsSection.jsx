import { MessageCircle, Search, UserMinus } from "lucide-react";
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import socket from "../socket";

const FriendsSection = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPending = async () => {
    try {
      const res = await api.get("/friends/pending");
      setPendingRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching pending:", err);
    }
  };

  // FETCH FRIEND LIST
  const fetchFriends = async () => {
    try {
      const res = await api.get("/friends/list");
      setAcceptedFriends(res.data.friends || []);
      
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  // FETCH REJECTED REQUESTS
  const fetchRejected = async () => {
    try {
      const res = await api.get("/friends/rejected");
      setRejectedRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching rejected:", err);
    }
  };


  useEffect(() => {
    fetchPending();
    fetchFriends();
    fetchRejected();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    }

    const handleConnect = () => {
      socket.emit('online-users');
    };

    const handleOnlineUsers = (userIds) => {
      setOnlineUserIds(userIds);
    };

    socket.on("connect", handleConnect);

    socket.on("friend-request-received", () => {
      fetchPending();
    });

    socket.on("friend-request-accepted", () => {
      fetchFriends();
    });

    socket.on("online-users", handleOnlineUsers);

    if (socket.connected) {
      socket.emit('online-users');
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("friend-request-received");
      socket.off("friend-request-accepted");
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  const isUserOnline = (id) => onlineUserIds.includes(id);


  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredFriends = acceptedFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleAccept = async (requesterId) => {
    try {
      await api.post("/friends/accept", { requesterId });
      fetchPending();
      fetchFriends();
    } catch (err) {
      console.error("Error accepting:", err);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await api.post("/friends/reject", { requesterId });
      fetchPending();
      fetchRejected();
    } catch (err) {
      console.error("Error rejecting:", err);
    }
  };


  const handleRemoveFriend = async (friendId) => {
    try {
      await api.post("/friends/remove", { friendId });
      fetchFriends();
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  return (
    <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-background-light">

      <div className="lg:col-span-2 flex flex-col gap-6">
        
        <h1 className="text-text-primary-dark text-4xl font-black">Friends</h1>

        <div className="flex border-b border-gray-200 gap-8">
          

          <button
            className={`pb-3 pt-2 border-b-[3px] ${
              activeTab === "pending"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary-dark hover:text-primary"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests
            <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 inline-flex items-center justify-center ml-2">
              {pendingRequests.length}
            </span>
          </button>


          <button
            className={`pb-3 pt-2 border-b-[3px] ${
              activeTab === "accepted"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary-dark hover:text-primary"
            }`}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted
          </button>


          <button
            className={`pb-3 pt-2 border-b-[3px] ${
              activeTab === "rejected"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary-dark hover:text-primary"
            }`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>

        {activeTab === "pending" && (
          <div className="flex flex-col divide-y divide-gray-200">
            {pendingRequests.length === 0 && (
              <p className="py-10 text-center text-gray-500">No pending requests</p>
            )}

            {pendingRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    {req.requester.avatar ? (
                      <img
                        src={req.requester.avatar}
                        alt={req.requester.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(req.requester.name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-text-primary-dark font-semibold">
                      {req.requester.name}
                    </p>
                    <p className="text-text-secondary-dark text-sm">
                      {req.requester.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(req.requester._id)}
                    className="rounded-full bg-gray-100 px-6 py-2.5 text-sm font-bold text-text-primary-dark hover:bg-gray-200"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(req.requester._id)}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-tertiary"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {activeTab === "accepted" && (
          <div className="flex flex-col divide-y divide-gray-200">
            {acceptedFriends.length === 0 && (
              <p className="py-10 text-center text-gray-500">No accepted friends yet</p>
            )}

            {acceptedFriends.map((friend) => (
              <div key={friend._id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      {friend.avatar ? (
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(friend.name)}</span>
                      )}
                    </div>

                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        isUserOnline(friend._id) ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-text-primary-dark font-semibold">
                      {friend.name}
                    </p>
                    <p className="text-text-secondary-dark text-sm">
                      {friend.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isUserOnline(friend._id) ? '🟢 Online' : '⚪ Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="rounded-full bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <button
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="rounded-full bg-red-100 px-6 py-2.5 text-sm font-bold text-red-600 hover:bg-red-200 flex items-center gap-2"
                  >
                    <UserMinus size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {activeTab === "rejected" && (
          <div className="flex flex-col divide-y divide-gray-200">
            {rejectedRequests.length === 0 && (
              <p className="py-10 text-center text-gray-500">No rejected requests</p>
            )}

            {rejectedRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between gap-4 py-4 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg overflow-hidden">
                    {req.requester?.avatar ? (
                      <img
                        src={req.requester.avatar}
                        alt={req.requester.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(req.requester?.name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-text-primary-dark font-semibold">
                      {req.requester?.name || 'Unknown'}
                    </p>
                    <p className="text-text-secondary-dark text-sm">
                      {req.requester?.email || ''}
                    </p>
                    <p className="text-xs text-red-500">Rejected</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>


      <div className="flex flex-col gap-6 rounded-2xl bg-gray-50 p-6 h-fit lg:sticky lg:top-8 shadow-md">

        <h2 className="text-2xl font-bold text-text-primary-dark">
          Friends List ({acceptedFriends.length})
        </h2>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-text-primary-dark 
                       placeholder:text-text-secondary-dark border border-transparent 
                       focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Search friends..."
          />
        </div>

        <div className="flex flex-col gap-2">
          {filteredFriends.length === 0 && searchQuery && (
            <p className="text-center text-gray-500 py-4">No friends found</p>
          )}
          {filteredFriends.map((friend) => (
            <div key={friend._id} className="flex items-center justify-between hover:bg-white p-3 rounded-xl">

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                    {friend.avatar ? (
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{getInitials(friend.name)}</span>
                    )}
                  </div>

                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-50 ${
                      isUserOnline(friend._id) ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                <p className="text-text-primary-dark font-semibold">{friend.name}</p>
              </div>

              <div className="flex gap-2">
                <button className="hover:bg-primary/20 rounded-full h-9 w-9 flex items-center justify-center text-text-secondary-dark hover:text-primary">
                  <MessageCircle size={18} />
                </button>

                <button
                  onClick={() => handleRemoveFriend(friend._id)}
                  className="hover:bg-red-200/40 rounded-full h-9 w-9 flex items-center justify-center text-red-400 hover:text-red-600"
                >
                  <UserMinus size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </main>
  );
};

export default FriendsSection;
