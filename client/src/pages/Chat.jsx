import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatContainer from '../components/Chat/ChatContainer';

const Chat = () => {
  return (
    <div className="flex h-[93vh] bg-gray-200 dark:bg-gray-900">
      <Sidebar />
      <ChatContainer />
    </div>
  );
};

export default Chat; 