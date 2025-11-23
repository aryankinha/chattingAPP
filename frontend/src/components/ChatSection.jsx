import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  ArrowUpDown,
} from "lucide-react";
import api from "../api/axios";
import socket from "../socket/index";

const ChatSection = () => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  const messagesEndRef = useRef(null);
  
  // Get user from localStorage
  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      user = JSON.parse(userStr);
      
      // IMPORTANT: Backend returns 'id' but we need '_id' for consistency
      // Normalize the user object to always have _id
      if (user.id && !user._id) {
        user._id = user.id;
      }
      
      // console.log("Current user:", user);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat rooms and ensure socket is connected
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/my");
        // console.log("Rooms loaded:", res.data.rooms);
        setRooms(res.data.rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    
    // Ensure socket is connected
    if (!socket.connected) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // console.log("🔌 Connecting socket...");
        socket.auth = { token };
        socket.connect();
      }
    } else {
      // console.log("✅ Socket already connected");
    }
    
    // Handle online users updates
    const handleOnlineUsers = (userIds) => {
      // console.log('Received online users in ChatSection:', userIds);
      setOnlineUserIds(userIds);
    };
    
    // Log socket connection status
    socket.on("connect", () => {
      // console.log("✅ Socket connected:", socket.id);
      // Request initial online users list when connected
      socket.emit('online-users');
    });
    
    socket.on("disconnect", () => {
      // console.log("❌ Socket disconnected");
    });
    
    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on('online-users', handleOnlineUsers);

    // If already connected, request immediately
    if (socket.connected) {
      socket.emit('online-users');
    }
    
    fetchRooms();
    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off('online-users', handleOnlineUsers);
    };
  }, []);

  // Load messages when selecting a room
  const loadMessages = async (room) => {
    if (!room || !room._id) {
      console.error("Invalid room:", room);
      return;
    }

    setActiveRoom(room);
    setLoadingMessages(true);

    try {
      // console.log("Loading messages for room:", room._id);
      const res = await api.get(`/messages/${room._id}`);
      // console.log("Messages loaded:", res.data);
      
      const messagesData = res.data.messages || [];
      // console.log("Messages array:", messagesData);
      
      setMessages(messagesData);
      setLoadingMessages(false);
      
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
      setLoadingMessages(false);
    }
  };

  // Listen for real-time incoming messages
  useEffect(() => {
    // console.log("🎧 Setting up socket listeners for room:", activeRoom?._id);
    // console.log("🔌 Socket connected:", socket.connected);
    
    const handleNewMessage = (msg) => {
      // console.log("📨 NEW-MESSAGE event received:", msg);
      // console.log("   - Message roomId:", msg.roomId);
      // console.log("   - Active roomId:", activeRoom?._id);
      // console.log("   - Sender ID:", msg.sender?._id);
      // console.log("   - Current user ID:", user._id);
      // console.log("   - Match:", msg.roomId === activeRoom?._id);
      
      // Add message to the current conversation if it's the active room
      if (msg.roomId === activeRoom?._id) {
        // console.log("✅ Adding message to current chat");
        setMessages((prev) => {
          // console.log("Previous messages count:", prev.length);
          return [...prev, msg];
        });
        setTimeout(() => scrollToBottom(), 100);
      } else {
        // console.log("⚠️ Message not for active room, skipping");
      }

      // Update room last message and move to top of the list
      setRooms((prev) => {
        const updatedRoom = prev.find((room) => room._id === msg.roomId);
        if (!updatedRoom) return prev;

        // Update the room with new last message
        const roomWithNewMessage = {
          ...updatedRoom,
          lastMessage: { text: msg.text, createdAt: msg.createdAt },
        };

        // Remove the room from its current position and add it to the top
        const otherRooms = prev.filter((room) => room._id !== msg.roomId);
        return [roomWithNewMessage, ...otherRooms];
      });
    };

    const handleReceiveMessage = (msg) => {
      // console.log("📨 RECEIVE-MESSAGE event received:", msg);
      
      if (msg.roomId === activeRoom?._id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      // console.log("🔇 Removing socket listeners");
      socket.off("new-message", handleNewMessage);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [activeRoom, user._id]);

  // Send message
  const sendMessage = async () => {
    if (!messageText.trim() || !activeRoom) return;

    try {
      const response = await api.post("/messages", {
        roomId: activeRoom._id,
        text: messageText,
      });

      // console.log("Message sent:", response.data);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Filter and sort rooms
  const getFilteredAndSortedRooms = () => {
    let filteredRooms = [...rooms];

    // Filter by search query
    if (searchQuery.trim()) {
      filteredRooms = filteredRooms.filter((room) => {
        const friend = room.participants?.find((p) => p._id !== user._id);
        if (!friend) return false;
        
        const searchLower = searchQuery.toLowerCase();
        return (
          friend.name?.toLowerCase().includes(searchLower) ||
          friend.email?.toLowerCase().includes(searchLower) ||
          room.lastMessage?.text?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Sort alphabetically if enabled
    if (sortAlphabetically) {
      filteredRooms.sort((a, b) => {
        const friendA = a.participants?.find((p) => p._id !== user._id);
        const friendB = b.participants?.find((p) => p._id !== user._id);
        
        const nameA = friendA?.name || '';
        const nameB = friendB?.name || '';
        
        return nameA.localeCompare(nameB);
      });
    }

    return filteredRooms;
  };

  // If no user, show error message
  if (!user || !user._id) {
    // console.error("No user found in localStorage");
    // console.log("localStorage user:", localStorage.getItem("user"));
    // console.log("Parsed user:", user);
    
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-500 font-bold mb-2 text-xl">⚠️ Not Logged In</p>
          <p className="text-gray-600 mb-4">Please log in to access chats</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90"
          >
            Go to Login
          </button>
          <details className="mt-4 text-left bg-gray-100 p-3 rounded">
            <summary className="cursor-pointer text-xs text-gray-500">Debug Info</summary>
            <pre className="text-xs mt-2 overflow-auto">
              localStorage.user: {localStorage.getItem("user") || "null"}{"\n"}
              Parsed: {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const filteredAndSortedRooms = getFilteredAndSortedRooms();

  return (
    <main className="flex-1 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] h-screen overflow-hidden bg-gray-50">

      <div className="flex flex-col bg-white border-r border-gray-200 h-screen overflow-hidden">
        
        <div className="p-6">
          <h1 className="text-4xl font-black">Chats</h1>

          {/* Search Bar with Sort Button */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            {/* Sort Button */}
            <button
              onClick={() => setSortAlphabetically(!sortAlphabetically)}
              className={`rounded-full p-3 flex items-center justify-center transition-colors ${
                sortAlphabetically
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={sortAlphabetically ? "Sorted A-Z (click to unsort)" : "Sort A-Z"}
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* Results count */}
          {searchQuery && (
            <p className="text-xs text-gray-500 mt-2">
              {filteredAndSortedRooms.length} result{filteredAndSortedRooms.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredAndSortedRooms.length === 0 && rooms.length === 0 && (
            <p className="text-center text-gray-500 py-10">No conversations yet</p>
          )}
          {filteredAndSortedRooms.length === 0 && rooms.length > 0 && (
            <p className="text-center text-gray-500 py-10">No chats match your search</p>
          )}
          {filteredAndSortedRooms.map((room) => {
            const friend = room.participants?.find((p) => p._id !== user._id);
            
            if (!friend) {
              // console.warn("Room missing friend participant:", room);
              return null;
            }

            const isOnline = onlineUserIds.includes(friend._id);

            return (
              <div
                key={room._id}
                onClick={() => loadMessages(room)}
                className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                  activeRoom?._id === room._id ? "bg-primary/10 border-r-4 border-primary" : ""
                }`}
              >
                <div className="relative">
                  {friend.avatar ? (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-xl">
                      {friend.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  {/* Online/Offline Status Indicator */}
                  <div 
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    title={isOnline ? 'Online' : 'Offline'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-semibold truncate">{friend.name}</p>
                    <span className="text-xs text-gray-400">
                      {room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleTimeString() : ""}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col bg-gray-50 h-screen overflow-hidden">

        {/* TOP BAR */}
        {activeRoom && (() => {
          const friend = activeRoom.participants.find((p) => p._id !== user._id);
          return (
            <div className="flex items-center justify-between p-4 border-b bg-white shrink-0">
              <div className="flex items-center gap-4">
                {friend?.avatar ? (
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-lg">
                    {friend?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-bold">{friend?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{friend?.email || ''}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {loadingMessages ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => {
              // Skip messages without proper data
              if (!msg || !msg._id) {
                // console.warn("Invalid message:", msg);
                return null;
              }

              // Check if sender exists and is valid
              if (!msg.sender || (typeof msg.sender === 'object' && !msg.sender._id)) {
                // console.warn("Message missing valid sender:", msg);
                return null;
              }

              // Handle both populated sender object and just sender ID
              const senderId = typeof msg.sender === 'object' && msg.sender._id 
                ? msg.sender._id 
                : msg.sender;
              
              const senderName = typeof msg.sender === 'object' && msg.sender.name 
                ? msg.sender.name 
                : 'Unknown';
              
              const senderAvatar = typeof msg.sender === 'object' && msg.sender.avatar 
                ? msg.sender.avatar 
                : null;
              
              // Final check - skip if senderId is still invalid
              if (!senderId || typeof senderId === 'undefined' || senderId === null) {
                // console.warn("Message with invalid senderId:", msg);
                return null;
              }
              
              // Convert both to strings for comparison (ObjectId vs string issue)
              const senderIdStr = String(senderId);
              const userIdStr = String(user._id);
              const isOwnMessage = senderIdStr === userIdStr;
              
              // console.log("Message:", msg._id, "Sender ID:", senderId, "User ID:", user._id, "Is Own:", isOwnMessage);
              
              return (
                <div
                  key={msg._id}
                  className={`flex gap-3 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwnMessage && senderAvatar && (
                    <img
                      src={senderAvatar}
                      alt={senderName}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  {!isOwnMessage && !senderAvatar && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm">
                      {senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className={`max-w-xl ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                    {!isOwnMessage && (
                      <span className="text-xs text-gray-600 mb-1 px-1">
                        {senderName}
                      </span>
                    )}
                    <div
                      className={`p-4 rounded-2xl ${
                        isOwnMessage
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-white border border-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  {isOwnMessage && (
                    <>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR - Fixed at bottom */}
        {activeRoom && (
          <div className="p-4 bg-white border-t flex items-center gap-4 shrink-0">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="w-full rounded-full border border-gray-300 py-3 px-5 bg-gray-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <button
              onClick={sendMessage}
              className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {!activeRoom && (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatSection;
