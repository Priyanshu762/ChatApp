import React from 'react'
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { CiSquarePlus } from 'react-icons/ci';
import { chatService } from '../services/chatService';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {setLoading} from '../store/slices/loaderSlice'


const SearchFriend = () => {
    const [user, setUser] = useState('');
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch= useDispatch();
    const {loading}=useSelector(state=>state.loader)
    console.log(loading);
    
    const handleFindFriend = async () => {
        if (!user.trim()) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await chatService.findFriends(user.trim());
            setResult(response || []);
            toast.success('Search completed successfully!');
        } catch (err) {
            console.error('Error searching for friend:', err);
            setError('Something went wrong.');
            setResult([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendFriendRequest = async (friendId) => {
        try {
            console.log("Sending....");
            
            const response = await chatService.sendFriendRequest(friendId);
            console.log('Friend request sent:', response);
            toast.success('Friend request sent successfully!');
            setResult(prev => prev.filter(res => res._id !== friendId)); // Remove sent request from results
        } catch (error) {
            console.error('Error sending friend request:', error);
            toast.error('Failed to send friend request. Please try again.');
        }
        finally{
        }
    };

    return (
        <div className="px-3 py-2 border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
            <div className="relative text-gray-600 dark:text-gray-300">
                <input
                    type="text"
                    placeholder="Search friends..."
                    className="w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    onChange={(e) => setUser(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFindFriend()}
                />
                <FaSearch
                    className="absolute right-2 top-2.5 text-xs cursor-pointer"
                    onClick={handleFindFriend}
                />
            </div>

            {/* Result Display */}
            <div className="mt-2 text-sm text-gray-800 dark:text-white">
                {isLoading ? (
                    <p className="text-blue-500 text-center">Searching...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : user.trim() && result.length === 0 ? (
                    <p className="text-red-500 text-center">No user found</p>
                ) : (
                    result.map((res) => (
                        <div
                            key={`${res._id}-${res.username}`}
                            className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={res.profilePicture || 'https://avatar.iran.liara.run/public'}
                                    alt={res.username}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-800 dark:text-white font-medium">
                                    {res.username}
                                </span>
                            </div>
                            <button
                                disabled={loading}
                                onClick={() => handleSendFriendRequest(res._id)}
                            >

                            <CiSquarePlus
                                className="cursor-pointer text-xl hover:text-green-500"
                                dis
                                />
                                </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default SearchFriend