import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loaderReducer from './slices/loaderSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    chat: chatReducer,
  },
});
