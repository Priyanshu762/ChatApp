import React, { useState, useEffect } from 'react';
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { chatService } from '../../services/chatService';
import { setMessages } from '../../store/slices/chatSlice';

const ChatInput = () => {
	const { selectedChat } = useSelector((state) => state.chat);
	const [loading, setLoading] = useState(false);
	const [messageData, setMessageData] = useState({
		recipientId: "",
		content: "",
		messageType: "text",
		mediaUrl: ""
	});
    const dispatch=useDispatch()
	// Update recipientId whenever selectedChat changes
	useEffect(() => {
		if (selectedChat?._id) {
			setMessageData((prev) => ({
				...prev,
				recipientId: selectedChat._id
			}));
		}
	}, [selectedChat]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!messageData.content.trim()) return;

		setLoading(true);
		try {
			console.log("Sending message:", messageData);
			await chatService.sendMessage(messageData);
			// clear input after sending
			setMessageData((prev) => ({
				...prev,
				content: ""
			}));
			// toast.success("Message sent!");
		} catch (err) {
			console.error("Failed to send message:", err);
			// toast.error("Failed to send");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="px-4 my-3" onSubmit={handleSubmit}>
			<div className="w-full relative">
				<input
					type="text"
					className="border text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 text-black dark:bg-gray-700 dark:text-white"
					placeholder="Send a message"
					value={messageData.content}
					onChange={(e) =>
						setMessageData((prev) => ({
							...prev,
							content: e.target.value
						}))
					}
				/>
				<button
					type="submit"
					className="absolute inset-y-0 end-0 flex items-center pe-3"
				>
					{loading ? (
						<div className="loading loading-spinner" />
					) : (
						<BsSend />
					)}
				</button>
			</div>
		</form>
	);
};

export default ChatInput;
