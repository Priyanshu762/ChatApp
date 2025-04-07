import React, { useState, useRef, useEffect } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Profile from './common/Profile';
import Friend from './Friend';
import { logout } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const handleIconClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFindFriends = () => {
    navigate('/find-friends');
    setIsModalOpen(false);
  };

  const handlePendingRequests = () => {
    navigate('/pending-requests');
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    dispatch(logout());
    // clear all local storage
    localStorage.clear()
    sessionStorage.clear()
    navigate('/login');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg h-[7vh]">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center p-1">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Chat App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaUserFriends
                size={22}
                onClick={handleIconClick}
                className="cursor-pointer"
              />
              {isModalOpen && (
               <Friend modalRef={modalRef}></Friend>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button
              className='bg-red-500 px-2 py-1 rounded-lg text-white hover:bg-red-600'
             onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
