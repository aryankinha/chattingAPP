import React, { useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatSection from "../components/ChatSection";
import GlobalSection from "../components/GlobalSection";
import FriendsSection from "../components/FriendsSection";
import ProfileSettings from "../components/ProfileSettings";

const Home = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch(activeTab) {
      case 'chat':
        return <ChatSection />;
      case 'global':
        return <GlobalSection />;
      case 'friends':
        return <FriendsSection />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <ChatSection />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fefefe]">
      <ChatSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
