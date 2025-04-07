import { fetchFriends, findFriend, sendFriendRequest ,getFriendRequests, acceptFriendRequest, rejectFriendRequest, sendMessage, fetchMessages } from '../API/chatAPI';
export const chatService = {
  getFriends: async () => {
    const response = await fetchFriends();
    console.log("FetchFriends response in chatService",response.data.friends);
    return response.data.friends;
  },
  findFriends:async (user)=>{
    console.log("Sending request to the find friend:",user);
    
    const response=await findFriend(user);
    console.log("completed");
    
    console.log(response);
    return response.data;
  },
  sendFriendRequest: async (friendId) => {
    const response = await sendFriendRequest(friendId);
    console.log("response in chatService sendFriendRequest",response);
    return response;
  },
  getFriendRequest: async () => {
    const response = await getFriendRequests();
    console.log("response in chatService getFriendRequet",response);
    return response.data.friendRequests;
  },
  acceptFriendRequest: async(id)=>{
    const userId=id

    const response= await acceptFriendRequest(userId)
    console.log("Response from accept FriendRequest chat service:",response)
    return response
  },
  rejectFriendRequest: async(id)=>{
    const userId=id
    const response=await rejectFriendRequest(userId)
    console.log("Response from reject FriendRequest chat service:",response)
    return response
  },
  sendMessage:async(messagedata)=>{
    const response=await sendMessage(messagedata);
    console.log("Response from Send Message frrom chat service:",response)
    return response
  },
  getMessage:async(selectedChatId)=>{
    const response=await fetchMessages(selectedChatId);
    console.log("Response from Get Message frrom chat service:",response)
    return response
  }



  
}












// import { fetchFriends , getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, fetchMessages, fetchRecentChats, fetchUnreadCount, sendMessage   } from '../API/chatAPI';

// export const chatService = {
//   fetchFriends: async () => {
//     const response = await fetchFriends();
//     console.log("response in chatService",response);
//     return response;
//   },
//   fetchFriendRequests: async () => {
//     const response = await getFriendRequests();
//     return response;
//   },
//   sendFriendRequest: async (userId) => {
//     const response = await sendFriendRequest(userId);
//     return response;
//   },
//   acceptFriendRequest: async (userId) => {
//     const response = await acceptFriendRequest(userId);
//     return response;    
//   },
//   rejectFriendRequest: async (userId) => {
//     const response = await rejectFriendRequest(userId);
//     return response;
//   },
//   fetchMessages: async (userId) => {
//     const response = await fetchMessages(userId);
//     return response;
//   },
//   fetchRecentChats: async () => {
//     const response = await fetchRecentChats();
//     return response;
//   },
//   fetchUnreadCount: async () => {
//     const response = await fetchUnreadCount();
//     return response;
//   },
//   sendMessage: async (messageData) => {
//     const response = await sendMessage(messageData);
//     return response;
//   },
// };

 

// export default chatService;

