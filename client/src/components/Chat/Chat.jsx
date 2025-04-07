import React from 'react';
import { useSelector } from 'react-redux';
import formatDateTime from '../../utils/formatDateTime';

const Chat = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isSender = message.sender._id === user._id;
  const formattedTime = formatDateTime(message.createdAt);

  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} w-full mt-1 gap-1`}
    >
      <div
        className={`max-w-[40%] rounded-lg px-4 py-1 shadow-sm
          ${isSender
            ? 'bg-blue-500 text-white dark:text-gray-900'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
      >
        <p className="text-sm break-words">{message.content}</p>
      </div>
      <div className=' flex justify-end items-end'>

        <span className="text-xs opacity-75 mt-1 block text-right">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default Chat;
