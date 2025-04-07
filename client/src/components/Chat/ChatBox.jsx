import React from 'react';
import ChatContainer from './ChatContainer';

const ChatBox=()=>{
  return(
    <p>hie</p>
  )
}
export default ChatBox;













// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import io from 'socket.io-client';
// import {
//   fetchMessages,
//   fetchUnreadCount,
//   setUserOnline,
//   setUserOffline,
//   setOnlineUsers,
//   addMessage,
//   clearMessages,
//   sendMessage,
// } from '../../store/slices/chatSlice';
// import { chatService } from '../../services/chatService';
// import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

// const ChatBox = () => {
//   const dispatch = useDispatch();
//   const { selectedChat, messages, onlineUsers, loading } = useSelector((state) => state.chat);
//   const { user } = useSelector((state) => state.auth);
//   const [newMessage, setNewMessage] = useState('');
//   const [socket, setSocket] = useState(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Fetch messages when selected chat changes
//   useEffect(() => {
//     if (selectedChat) {
//       dispatch(clearMessages()); // Clear current messages
//       dispatch(fetchMessages({ friendId: selectedChat._id })); // Fetch new messages
//       dispatch(fetchUnreadCount());
//     }
//   }, [dispatch, selectedChat]);

//   // Socket connection and event handling
//   useEffect(() => {
//     if (selectedChat) {
//       const newSocket = io('http://localhost:5000', {
//         auth: {
//           token: localStorage.getItem('token'),
//         },
//       });

//       newSocket.on('connect', () => {
//         console.log('Connected to socket server');
//       });

//       newSocket.on('user_connected', (userId) => {
//         dispatch(setUserOnline(userId));
//       });

//       newSocket.on('user_disconnected', (userId) => {
//         dispatch(setUserOffline(userId));
//       });

//       newSocket.on('new_message', (message) => {
//         if (message.senderId === selectedChat._id || message.receiverId === selectedChat._id) {
//           dispatch(addMessage(message));
//         }
//       });

//       setSocket(newSocket);

//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [dispatch, selectedChat]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       const messageData = {
//         recipientId: selectedChat._id,
//         content: newMessage,
//         messageType: 'text',
//       };

//       console.log('messageData from chatbox:', messageData);
//       // Emit message through socket
//       socket.emit('send_message', messageData);
      
//       // Add message to local state
//       dispatch(sendMessage(messageData));
      
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   if (!selectedChat) {
//     return (
//       <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
//       {/* Chat Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-3">
//           <img
//             src={selectedChat.profilePicture}
//             alt={selectedChat.username}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               {selectedChat.fullName}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {onlineUsers.includes(selectedChat._id) ? 'Online' : 'Offline'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
//           </div>
//         ) : (
//           messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 message.senderId === user._id ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div
//                 className={`max-w-[70%] rounded-lg p-3 ${
//                   message.senderId === user._id
//                     ? 'bg-primary-500 text-white'
//                     : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
//                 }`}
//               >
//                 <p className="text-sm">{message.content}</p>
//                 <span className="text-xs opacity-75 mt-1 block">
//                   {new Date(message.timestamp).toLocaleTimeString()}
//                 </span>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
//           />
//           <button
//             type="submit"
//             disabled={!newMessage.trim() || loading}
//             className="bg-primary-500 text-white rounded-lg px-4 py-2 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <PaperAirplaneIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatBox; 