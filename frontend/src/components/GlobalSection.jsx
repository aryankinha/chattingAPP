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

const GlobalSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addingFriend, setAddingFriend] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Filter users based on search
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = (userId) => {
    setAddingFriend(userId);
    setTimeout(() => {
      setAddingFriend(null);
      // Here you would make an API call to add friend
    }, 1000);
  };

  const onlineCount = allUsers.filter(u => u.status === 'online').length;

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
                  {allUsers.length} total • {onlineCount} online
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
                          {/* Status Indicator */}
                          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-[#fefefe]`}></div>
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
                        {user.status === 'online' ? '🟢 Online' : '⚪ Offline'}
                      </p>
                      {user.lastSeen && user.status === 'offline' && (
                        <p className="text-xs text-[#66342b]/40 mt-1">
                          Last seen: {new Date(user.lastSeen).toLocaleDateString()}
                        </p>
                      )}
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