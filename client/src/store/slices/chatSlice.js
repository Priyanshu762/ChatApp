import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/chatService';

// Get selected chat from session storage if it exists
const getSelectedChatFromStorage = () => {
  const selectedChat = sessionStorage.getItem('selectedChat');
  return selectedChat ? JSON.parse(selectedChat) : null;
};

const initialState = {
  friends: [],
  friendRequests: [],
  selectedChat: getSelectedChatFromStorage(),
  messages: [],
  recentChats: [],
  unreadCount: 0,
  loading: false,
  error: null,
  onlineUsers: [],
  chatHistory: {}, // Store chat history for each friend
};

export const fetchFriends = createAsyncThunk('chat/fetchFriends', async (_, { rejectWithValue }) => {
  try {
    const response = await chatService.getFriends();
    return response;
  } catch (error) {
    return rejectWithValue(error.response || error.message);
  }
});
export const getFriendRequests=createAsyncThunk(
  'auth/getFriendRequests',
  async (_,{ rejectWithValue }) => {
    try {
      const response = await chatService.getFriendRequest();
      console.log("Response from get request slice thunk",response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  })
  export const fetchMessages=createAsyncThunk('chat/fetchMessages',async(selectedChatId,{ rejectWithValue})=>{
    try {
      const response =await chatService.getMessage(selectedChatId);
      console.log("Respomse from Get firend thunk",response);
      return response.data.messages
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  })
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      // Save to session storage
      if (action.payload) {
        sessionStorage.setItem('selectedChat', JSON.stringify(action.payload));
      } else {
        sessionStorage.removeItem('selectedChat');
      }
    },
    removeFriendRequest: (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        request => request._id !== action.payload
      );
    },
    setMessages:(state,action)=>{
      state.messages=action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessageLocally: (state, action) => {
      state.messages.push(action.payload);
  },
    
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
      })
      .addCase(getFriendRequests.fulfilled,(state,action)=>{
        state.friendRequests=action.payload;
      })
      .addCase(fetchMessages.fulfilled,(state,action)=>{
        state.messages=action.payload;
      })
              
  }
});

export const { setFriends, setSelectedChat,removeFriendRequest, setMessages ,clearMessages,addMessageLocally} = chatSlice.actions;
export default chatSlice.reducer;




// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { chatService } from '../../services/chatService';

// const initialState = {
//     friends: [],
//     friendRequests: [],
//     selectedChat: null,
//     messages: [],
//     recentChats: [],
//     unreadCount: 0,
//     loading: false,
//     error: null,
//     onlineUsers: [],
//     chatHistory: {}, // Store chat history for each friend
// };

// // Async thunk action creators
// export const fetchMessages = createAsyncThunk(
//   'chat/fetchMessages',
//   async ({ friendId }, { rejectWithValue }) => {
//     try {
//       const response = await chatService.fetchMessages(friendId);
//       console.log('response of fetchMessages:', response);
//       return { friendId, messages: response.data.messages };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchUnreadCount = createAsyncThunk(
//   'chat/fetchUnreadCount',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await chatService.fetchUnreadCount();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const sendMessage = createAsyncThunk(
//   'chat/sendMessage',
//   async (messageData, { rejectWithValue }) => {
//     try {
//       const response = await chatService.sendMessage(messageData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


// const chatSlice = createSlice({
//     name: 'chat',
//     initialState,
//     reducers: {
//       setSelectedChat: (state, action) => {
//         state.selectedChat = action.payload;
//         // Set current messages from chat history when selecting a chat
//         if (action.payload && state.chatHistory[action.payload._id]) {
//           state.messages = state.chatHistory[action.payload._id];
//         } else {
//           state.messages = [];
//         }
//       },
//       addMessage: (state, action) => {
//         const message = action.payload;
//         state.messages.push(message);
        
//         // Update chat history for both sender and receiver
//         if (message.senderId) {
//           if (!state.chatHistory[message.senderId]) {
//             state.chatHistory[message.senderId] = [];
//           }
//           state.chatHistory[message.senderId].push(message);
//         }
//         if (message.receiverId) {
//           if (!state.chatHistory[message.receiverId]) {
//             state.chatHistory[message.receiverId] = [];
//           }
//           state.chatHistory[message.receiverId].push(message);
//         }
//       },
//       clearMessages: (state) => {
//         state.messages = [];
//       },
//       setUserOnline: (state, action) => {
//         if (!state.onlineUsers.includes(action.payload)) {
//           state.onlineUsers.push(action.payload);
//         }
//       },
//       setUserOffline: (state, action) => {
//         state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
//       },
//       setOnlineUsers: (state, action) => {
//         state.onlineUsers = action.payload;
//       },
//       setFriends: (state, action) => {
//         state.friends = action.payload;
//       },
//       setFriendRequests: (state, action) => {
//         state.friendRequests = action.payload;
//       },
//     },
//     extraReducers: (builder) => {
//       builder
//         .addCase(fetchMessages.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(fetchMessages.fulfilled, (state, action) => {
//           state.loading = false;
//           const { friendId, messages } = action.payload;
//           state.messages = messages;
//           state.chatHistory[friendId] = messages;
//         })
//         .addCase(fetchMessages.rejected, (state, action) => {
//           state.loading = false;
//           state.error = action.payload;
//         })
//         .addCase(fetchUnreadCount.fulfilled, (state, action) => {
//           state.unreadCount = action.payload;
//         })
//         .addCase(sendMessage.fulfilled, (state, action) => {
//           state.messages.push(action.payload);
//           console.log('messages from chatSlice:', state.messages);
//         });
//     }
// });

// export const {
//   setSelectedChat,
//   addMessage,
//   clearMessages,
//   setUserOnline,
//   setUserOffline,
//   setOnlineUsers,
//   setFriends,
//   setFriendRequests,
// } = chatSlice.actions;

// export default chatSlice.reducer; 