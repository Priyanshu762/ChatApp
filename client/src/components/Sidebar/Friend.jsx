import { clearMessages, setSelectedChat } from '../../store/slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../store/slices/chatSlice';

const Friend = ({ friends,  }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  return (
   <>
     {friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => {dispatch(setSelectedChat(friend))
                const selectedChatId=friend._id;
                dispatch(fetchMessages(selectedChatId))
              }}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedChat?._id === friend._id
                  ? 'bg-primary-100 dark:bg-primary-900 border-1 border-primary-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <img
                src={friend.profilePicture}
                alt={friend.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {friend.fullName}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {friend.username}
                </p>
              </div>
            </div>
          ))}
   </>
  );
};

export default Friend;

