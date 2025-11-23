import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  UserPlus,
  User,
  MoreVertical,
  Users,
  Loader2
} from 'lucide-react';
import api from '../api/axios';
import socket from '../socket/index.js';

const GlobalSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addingFriend, setAddingFriend] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/all');
        
        if (response.data.success) {
          setAllUsers(response.data.users);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Listen for real-time online users updates
  useEffect(() => {
    // Ensure socket is connected
    if (!socket.connected) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    }

    // Listen for updates
    const handleOnlineUsers = (userIds) => {
      console.log('Received online users:', userIds);
      setOnlineUserIds(userIds);
    };

    const handleConnect = () => {
      console.log('Socket connected in GlobalSection');
      // Request initial online users list when connected
      socket.emit('online-users');
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
    };

    // Set up listeners
    socket.on('connect', handleConnect);
    socket.on('online-users', handleOnlineUsers);
    socket.on('disconnect', handleDisconnect);

    // If already connected, request immediately
    if (socket.connected) {
      socket.emit('online-users');
    }

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('online-users', handleOnlineUsers);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if user is online (real-time from socket)
  const isUserOnline = (userId) => {
    return onlineUserIds.includes(userId);
  };

  // Get status color based on real-time online status
  const getStatusColor = (userId) => {
    return isUserOnline(userId) ? 'bg-green-500' : 'bg-gray-400';
  };

  // Filter users based on search
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = async (userId) => {
    setAddingFriend(userId);
    try {
      const response = await api.post('/friends/request', { recipientId: userId });
      
      if (response.data.message) {
        alert(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send friend request';
      alert(errorMessage);
      console.error('Failed to send friend request:', err);
    } finally {
      setAddingFriend(null);
    }
  };

  // Calculate online count from real-time socket data
  const onlineCount = allUsers.filter(user => isUserOnline(user._id)).length;
  const offlineCount = allUsers.length - onlineCount;

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#fefefe]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3d3636] to-[#66342b] px-6 py-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fe795f] to-[#da7d6c] flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 text-[#fefefe]" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#fefefe]">All Users</h1>
                <p className="text-sm text-[#da7d6c]">
                  {allUsers.length} total • <span className="text-green-400">{onlineCount} online</span> • <span className="text-gray-400">{offlineCount} offline</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#fefefe]/10 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5 text-[#da7d6c]" />
              <span className="text-[#fefefe] font-semibold">{filteredUsers.length}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#66342b]/50" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#fefefe] border border-[#da7d6c]/20 focus:border-[#fe795f] focus:outline-none focus:ring-2 focus:ring-[#fe795f]/20 transition-all text-[#3d3636] placeholder:text-[#66342b]/40"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#fefefe] to-[#da7d6c]/5 p-6">
          <div className="max-w-7xl mx-auto">
            
            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="w-16 h-16 text-[#fe795f] mx-auto mb-4 animate-spin" />
                <p className="text-[#66342b]/60 text-lg">Loading users...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <User className="w-16 h-16 text-[#66342b]/30 mx-auto mb-4" />
                <p className="text-[#66342b]/60 text-lg">Failed to load users</p>
                <p className="text-[#66342b]/40 text-sm mt-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-[#fe795f] text-[#fefefe] rounded-lg hover:bg-[#da7d6c] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20">
                <User className="w-16 h-16 text-[#66342b]/30 mx-auto mb-4" />
                <p className="text-[#66342b]/60 text-lg">No users found</p>
                <p className="text-[#66342b]/40 text-sm mt-2">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {filteredUsers.map(user => (
                  <div 
                    key={user._id}
                    className="bg-[#fefefe] rounded-xl p-5 border border-[#da7d6c]/20 hover:border-[#fe795f] hover:shadow-lg transition-all duration-200 group"
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fe795f] to-[#da7d6c] flex items-center justify-center shadow-md">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-[#fefefe] font-bold text-sm">
                                {getInitials(user.name)}
                              </span>
                            )}
                          </div>
                          {/* Status Indicator - Real-time */}
                          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user._id)} rounded-full border-2 border-[#fefefe]`}></div>
                        </div>
                      </div>

                      {/* More Options */}
                      <button className="text-[#66342b]/40 hover:text-[#fe795f] transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* User Info */}
                    <div className="mb-4">
                      <h3 className="font-bold text-[#3d3636] mb-1 truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs text-[#66342b]/60 mb-2 truncate">{user.email}</p>
                      <p className="text-sm text-[#66342b]/80 truncate">
                        {isUserOnline(user._id) ? '🟢 Online' : '⚪ Offline'}
                      </p>
                    </div>

                    {/* Add Friend Button */}
                    <button
                      onClick={() => handleAddFriend(user._id)}
                      disabled={addingFriend === user._id}
                      className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        addingFriend === user._id
                          ? 'bg-[#66342b]/20 text-[#66342b]/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#fe795f] to-[#da7d6c] text-[#fefefe] hover:shadow-md hover:scale-105'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {addingFriend === user._id ? 'Adding...' : 'Add Friend'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default GlobalSection;