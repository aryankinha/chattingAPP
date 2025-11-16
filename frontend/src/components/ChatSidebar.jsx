import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Globe, LogOut } from 'lucide-react';
import { LogoutUser } from '../api/axios';

const ChatSidebar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await LogoutUser();
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to login even if API call fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  return (
    /* Sidebar — NOW PURE WHITE */
    <div className="w-20 bg-[#fefefe] flex flex-col items-center py-6 border-r border-[#e5e5e5]">

        {/* Logo */}
        <div className="mb-10">
          <div className="w-12 h-12 bg-[#fe795f] rounded-2xl flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer">
            <MessageCircle className="w-6 h-6 text-[#fefefe]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col items-center gap-6 mt-4">

          {/* Chat Button */}
          <button
            onClick={() => onTabChange('chat')}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all
              ${activeTab === 'chat'
                ? 'bg-[#fe795f] shadow-sm'
                : 'hover:bg-[#f2f2f2]'}
            `}
          >
            <MessageCircle
              className={`w-6 h-6 ${
                activeTab === 'chat' ? 'text-[#fefefe]' : 'text-[#da7d6c]'
              }`}
              strokeWidth={2}
            />

            {activeTab === 'chat' && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#fe795f] rounded-r-full" />
            )}
          </button>

          {/* Global Button */}
          <button
            onClick={() => onTabChange('global')}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all
              ${activeTab === 'global'
                ? 'bg-[#fe795f] shadow-sm'
                : 'hover:bg-[#f2f2f2]'}
            `}
          >
            <Globe
              className={`w-6 h-6 ${
                activeTab === 'global' ? 'text-[#fefefe]' : 'text-[#da7d6c]'
              }`}
              strokeWidth={2}
            />

            {activeTab === 'global' && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#fe795f] rounded-r-full" />
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4">

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#f2f2f2] transition-all"
          >
            <LogOut className="w-5 h-5 text-[#da7d6c]" strokeWidth={2} />
          </button>

          {/* Profile */}
          <button onClick={() => onTabChange('profile')} className="relative">
            <div className="w-12 h-12 rounded-full bg-[#da7d6c] flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer border-2 border-[#66342b]">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-[#fefefe] font-bold text-sm">
                  {getInitials(user.name || 'User')}
                </span>
              )}
            </div>

            {activeTab === 'profile' && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#fe795f] rounded-r-full" />
            )}
          </button>

        </div>
      </div>
  );
};

export default ChatSidebar;
