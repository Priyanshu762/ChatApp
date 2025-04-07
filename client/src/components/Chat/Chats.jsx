import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import Chat from './Chat';
import { fetchMessages, clearMessages } from '../../store/slices/chatSlice';
import groupMessagesByDate from '../../utils/groupMessagesByDate';

const Chats = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.loader);
    const { selectedChat, messages } = useSelector((state) => state.chat);
    const user = useSelector((state) => state.auth.user);
    const lastMessageRef = useRef();

    useEffect(() => {
        if (selectedChat?._id) {
            dispatch(clearMessages());
            dispatch(fetchMessages(selectedChat._id));
        } else {
            dispatch(clearMessages());
        }
    }, [selectedChat, dispatch]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const groupedMessages = groupMessagesByDate(messages);
    const groupedKeys = Object.keys(groupedMessages);

    const formatGroupLabel = (dateStr) => {
        const today = new Date();
        const msgDate = new Date(dateStr);
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (msgDate.toDateString() === today.toDateString()) return 'Today';
        if (msgDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return `${msgDate.getDate().toString().padStart(2, '0')}/${(msgDate.getMonth() + 1).toString().padStart(2, '0')}/${msgDate.getFullYear().toString().slice(-2)}`;
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            ) : !selectedChat ? (
                <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-300">
                    <p className="text-center text-lg">Select a chat to start messaging</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-300">
                    <p className="text-center text-lg">Start messaging...</p>
                </div>
            ) : (
                groupedKeys.map((date, groupIndex) => (
                    <div key={date}>
                        {/* Date Separator */}
                        <div className="flex justify-center my-4">
                            <span className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-100 text-xs py-1 px-3 rounded-full ">
                                {formatGroupLabel(date)}
                            </span>
                        </div>

                        {/* Messages in this group */}
                        {groupedMessages[date].map((message, index) => (
                            <div
                                key={message._id || index}
                                className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start' }`}
                                ref={
                                    groupIndex === groupedKeys.length - 1 &&
                                    index === groupedMessages[date].length - 1
                                        ? lastMessageRef
                                        : null
                                }
                            >
                                <Chat message={message} />
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Chats;
