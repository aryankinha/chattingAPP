import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatSection = () => {
  return (
    <div className="flex h-screen bg-[#fefefe] items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#fe795f] to-[#da7d6c] rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6">
          <MessageCircle className="w-12 h-12 text-[#fefefe]" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold text-[#3d3636] mb-3">Chat Section</h2>
        <p className="text-[#66342b]/60 text-lg">
          Coming soon! This will be your chat interface.
        </p>
        <p className="text-[#66342b]/40 text-sm mt-2">
          Chat with your friends and manage conversations
        </p>
      </div>
    </div>
  );
};

export default ChatSection;
