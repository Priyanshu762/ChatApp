import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends, getFriendRequests } from '../../store/slices/chatSlice';
import SearchInput from './SearchInput';
import { useEffect } from 'react';
import FriendsList from './FriendsList';
const Sidebar = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.chat.friends) || [];
  
  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(getFriendRequests());

  }, [dispatch]);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <SearchInput />
      <FriendsList/>
    </div>
  );
};

export default Sidebar;



















// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setFriends, setSelectedChat } from '../../store/slices/chatSlice';
// import { chatService } from '../../services/chatService';
// import { FiUserPlus, FiUserMinus, FiCheck, FiX } from 'react-icons/fi';
// import { toast } from 'react-hot-toast';
// import FriendsList from './FriendsList';
// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const { friends, selectedChat } = useSelector((state) => state.chat);
//   const { user } = useSelector((state) => state.auth);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFriends, setFilteredFriends] = useState([]);
//   const [friendRequests, setFriendRequests] = useState([]);
 
//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const response = await chatService.fetchFriends();
//         if (response.data.friends && Array.isArray(response.data.friends)) {
//           dispatch(setFriends(response.data.friends));
//         } else {
//           toast.error('Failed to fetch friends');
//         }
//       } catch (error) {
//         toast.error('Failed to fetch friends');
//       }
//     };
//     fetchFriends();
//   }, [dispatch]);

//   useEffect(() => {
//     if (Array.isArray(friends)) {
//       const filtered = friends.filter((friend) =>
//         friend.username.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredFriends(filtered);
//     } else {
//       setFilteredFriends([]);
//     }
//   }, [friends, searchQuery]);

//   const handleFriendRequest = async (userId, action) => {
//     try {
//       if (action === 'accept') {
//         await chatService.acceptFriendRequest(userId);
//         toast.success('Friend request accepted!');
//         // Refresh friends list
//         const response = await chatService.fetchFriends();
//         if (response.data && Array.isArray(response.data)) {
//           dispatch(setFriends(response.data));
//         }
//       } else {
//         await chatService.rejectFriendRequest(userId);
//         toast.success('Friend request rejected');
//       }
//     } catch (error) {
//       toast.error(error.message || 'Failed to process friend request');
//     }
//   };

//   return (
//     <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
//       {/* Search Bar */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <input
//           type="text"
//           placeholder="Search friends..."
//           className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

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
//                 <div className="flex items-center space-x-3">
//                   <img
//                     src={request.pic}
//                     alt={request.name}
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     {request.name}
//                   </span>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleFriendRequest(request._id, 'accept')}
//                     className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
//                   >
//                     <FiCheck className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleFriendRequest(request._id, 'reject')}
//                     className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
//                   >
//                     <FiX className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Friends List */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4">
//           <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
//             Friends
//           </h3>
//           <div className="space-y-2">
//             {filteredFriends.map((friend) => (
//               <div
//                 key={friend._id}
//                 onClick={() => {dispatch(setSelectedChat(friend))
//                   console.log("selectedChat:",selectedChat);
                  
//                 }}
//                 className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
//                   selectedChat?._id === friend._id
//                     ? 'bg-primary-100 dark:bg-primary-900'
//                     : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <img
//                   src={friend.profilePicture}
//                   alt={friend.username}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex-1">
//                   <h4 className="text-sm font-medium text-gray-900 dark:text-white">
//                     {friend.fullName}
//                   </h4>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {friend.username}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar; 