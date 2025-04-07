import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, currentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await currentUser();
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        setError(error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};                          
