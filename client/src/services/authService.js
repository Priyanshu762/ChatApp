// import { register, login, logout, getCurrentUser } from '../API/authAPI';

// export const registerUser = async (userData) => {
//   const response = await register(userData);
//   return response;
// };

// export const loginUser = async (userData) => {
//   const response = await login(userData);
//   return response;
// };


// export const logoutUser = async () => {
//   const response = await logout();
//   return response;
// };  

// export const currentUser = async () => {
//   const response = await getCurrentUser();
//   return response;
// };


import { useDispatch } from 'react-redux';
import { register, login, logout } from '../API/authAPI';


export const authService = {
  login: async (credentials) => {
    const response = await login(credentials);
    return response;
  },

  register: async (userData) => {
    const response = await register(userData);
    return response;
  },

  logout: async () => {
    try {
      const response = await logout();
      console.log("response in authService",response);
      return response;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  }
};



