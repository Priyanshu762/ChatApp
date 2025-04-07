import axios from '../utils/axios';

export const fetchFriends = async () => {
  const response = await axios.get('/friends/list');
  return response.data;
};
export const getFriendRequests = async () => {
  const response = await axios.get('/friends/requests');
  return response.data;
};

export const sendFriendRequest = async (friendId) => {
  const response = await axios.post(`/friends/request/${friendId}`);
  return response.data;
};

export const findFriend = async (user) => {
  try {
    const response = await axios.get(`/friends/findfriend/${user}`);
    if (!response.data || response.data.length === 0) {
      return null;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptFriendRequest = async (userId) => {
  const response = await axios.post(`/friends/request/${userId}/accept`);
  return response.data;
};

export const rejectFriendRequest = async (userId) => {
  const response = await axios.post(`/friends/request/${userId}/reject`);
  return response.data;
};

export const fetchMessages = async (selectedChat) => {
  const response = await axios.get(`chat/history/${selectedChat}`);
  return response.data;
};

export const fetchRecentChats = async () => {
  const response = await axios.get('/friends/recent');
  return response.data;
};

export const fetchUnreadCount=async()=>{
  const response=await axios.get('/friends/unread');
  return response.data;
};
 
export const sendMessage=async(messageData)=>{
  const response=await axios.post('/chat/message',messageData);
  console.log('response of sendMessage:', response);
  return response.data;
};

















