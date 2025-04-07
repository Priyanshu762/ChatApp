import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setSelectedChat } from '../../store/slices/chatSlice';
import Friend from './Friend';
const FriendsList = () => {
  const friends = useSelector((state) => state.chat.friends) || [];
 
  

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 ">
          Friends
        </h3>
        <div className="space-y-2">
          <Friend friends={friends}  />
        </div>
      </div>
    </div>
  );
};

export default FriendsList;










// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchFriends,
//   fetchFriendRequests,
//   sendFriendRequest,
//   acceptFriendRequest,
//   rejectFriendRequest,
//   setSelectedChat,
// } from '../../store/slices/chatSlice';
// import { UserPlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// const FriendsList = () => {
//   const dispatch = useDispatch();
//   const { friends, friendRequests, selectedChat, onlineUsers } = useSelector(
//     (state) => state.chat
//   );

//   useEffect(() => {
//     dispatch(fetchFriends());
//     dispatch(fetchFriendRequests());
//   }, [dispatch]);

//   const handleSendRequest = async (userId) => {
//     try {
//       await dispatch(sendFriendRequest(userId)).unwrap();
//       toast.success('Friend request sent');
//     } catch (error) {
//       toast.error(error.message || 'Failed to send friend request');
//     }
//   };

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       await dispatch(acceptFriendRequest(requestId)).unwrap();
//       toast.success('Friend request accepted');
//     } catch (error) {
//       toast.error(error.message || 'Failed to accept friend request');
//     }
//   };

//   const handleRejectRequest = async (requestId) => {
//     try {
//       await dispatch(rejectFriendRequest(requestId)).unwrap();
//       toast.success('Friend request rejected');
//     } catch (error) {
//       toast.error(error.message || 'Failed to reject friend request');
//     }
//   };

//   return (
//     <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//       {/* Friend Requests */}
//       {friendRequests.length > 0 && (
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
//             Friend Requests
//           </h3>
//           <div className="space-y-2">
//             {friendRequests.map((request) => (
//               <div
//                 key={request._id}
//                 className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
//               >
//                 <div className="flex items-center space-x-2">
//                   <img
//                     src={request.sender.profilePicture || 'https://via.placeholder.com/32'}
//                     alt={request.sender.fullName}
//                     className="w-8 h-8 rounded-full"
//                   />
//                   <span className="text-sm text-gray-900 dark:text-white">
//                     {request.sender.fullName}
//                   </span>
//                 </div>
//                 <div className="flex space-x-1">
//                   <button
//                     onClick={() => handleAcceptRequest(request._id)}
//                     className="p-1 text-green-500 hover:text-green-600"
//                   >
//                     <CheckIcon className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleRejectRequest(request._id)}
//                     className="p-1 text-red-500 hover:text-red-600"
//                   >
//                     <XMarkIcon className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Friends List */}
//       <div className="p-4">
//         <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
//           Friends
//         </h3>
//         <div className="space-y-2">
//           {friends.map((friend) => {
//             const isOnline = onlineUsers.includes(friend._id);
//             return (
//               <div
//                 key={friend._id}
//                 onClick={() => dispatch(setSelectedChat(friend))}
//                 className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
//                   selectedChat?._id === friend._id
//                     ? 'bg-primary-50 dark:bg-primary-900/20'
//                     : 'hover:bg-gray-50 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={friend.profilePicture || 'https://via.placeholder.com/40'}
//                     alt={friend.fullName}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   {isOnline && (
//                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                     {friend.fullName}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {isOnline ? 'Online' : 'Offline'}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FriendsList; 