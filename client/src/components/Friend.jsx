
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import { chatService } from '../services/chatService';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchFriends, getFriendRequests } from '../store/slices/chatSlice';
import { removeFriendRequest } from '../store/slices/chatSlice';
import SearchFriend from './SearchFriend';
const Friend = ({ modalRef }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.loader.loading);
    const { friendRequests } = useSelector((state) => state.chat)
    const handleAcceptRequest = async (id) => {
        const toastId = toast.loading("Loading...");
        try {
            if (id) {
                await chatService.acceptFriendRequest(id);
                dispatch(removeFriendRequest(id)); // ✅ remove it from the array
                dispatch(fetchFriends())
                toast.success("Friend request accepted", { id: toastId });
            }
        } catch (error) {
            console.error("Error in handleAcceptRequest:", error);
            toast.error("Failed to accept request", { id: toastId });
        } finally {
            toast.dismiss(toastId);
        }
    };
    
    const handleRejectRequest = async (id) => {
        const toastId = toast.loading("Loading...");
        try {
            if (id) {
                await chatService.rejectFriendRequest(id); // <--- make sure you're calling the correct service method
                dispatch(removeFriendRequest(id)); // ✅ remove it from the array
                toast.success("Friend request rejected", { id: toastId });
            }
        } catch (error) {
            console.error("Error in handleRejectRequest:", error);
            toast.error("Failed to reject request", { id: toastId });
        } finally {
            toast.dismiss(toastId);
        }
    };
    



    useEffect(() => {
        dispatch(getFriendRequests());
    }, [dispatch]);


    return (
        <div
            ref={modalRef}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 min-h-[40vh] max-h-[70vh] flex flex-col"
        >
            {/* Header */}
            <div className="px-4 pt-3 pb-2">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Friend Requests</p>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-600 mx-3 mb-1"></div>

            {/* Friend Requests List */}
            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                {friendRequests.length === 0 ? (
                    <p className="text-sm text-center text-gray-500 dark:text-gray-300 py-4">No friend requests</p>
                ) : (

                    friendRequests.map(friendRequest => (
                        <div
                            key={`${friendRequest._id}-${friendRequest.sender.username}`}
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        >
                            <div className="flex items-center">
                                {/* avatar if awailable */}
                                <img
                                    src={friendRequest.image || 'https://avatar.iran.liara.run/public'}
                                    alt={friendRequest.username}
                                    className="rounded-full mr-2 w-6 h-6 object-cover"
                                />
                                {/* Username of request sender */}
                                <span className="text-sm text-gray-800 dark:text-white font-medium">
                                    {friendRequest.sender.username}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => {
                                        const id = friendRequest._id
                                        handleAcceptRequest(id)
                                    }}
                                    className="text-xs text-green-500 hover:underline"
                                >
                                    Accept
                                </button>
                                <span className="text-xs text-gray-400">/</span>
                                <button
                                    onClick={() => {
                                        const id = friendRequest._id
                                        handleRejectRequest(id)
                                    }
                                    }
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Search Section */}
            <SearchFriend></SearchFriend>

        </div>
    );
};

export default Friend;
