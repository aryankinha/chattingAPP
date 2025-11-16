import React, { useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatSection from "../components/ChatSection";
import GlobalSection from "../components/GlobalSection";

const Home = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch(activeTab) {
      case 'chat':
        return <ChatSection />;
      case 'global':
        return <GlobalSection />;
      case 'profile':
        return (
          <div className="flex h-screen bg-[#fefefe] items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#3d3636] mb-3">Profile Section</h2>
              <p className="text-[#66342b]/60 text-lg">Coming soon!</p>
            </div>
          </div>
        );
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
