import axios from '../utils/axios';
// import axios from 'axios';


export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    console.log("Response from:",response.data  );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post('/auth/logout');
    console.log("response in authAPI",response);
    return response;
  } catch (error) {
    throw error;
  }
};