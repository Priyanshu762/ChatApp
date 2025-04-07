import { useSelector } from 'react-redux';
import { TiMessage } from 'react-icons/ti';
import Chats from './Chats';
import ChatInput from './ChatInput';
const ChatContainer = () => {
    const user = useSelector((state) => state.auth.user);
    const selectedChat = useSelector((state) => state.chat.selectedChat);
    return <div className='flex-1 flex flex-col bg-white dark:bg-gray-800'>
        {!selectedChat?(<NoChatSelected fullName={user.fullName}/>):(
        <>
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={selectedChat.profilePicture}
              alt={selectedChat.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedChat.fullName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {/* {onlineUsers.includes(selectedChat._id) ? 'Online' : 'Offline'} */}
              </p>
            </div>
          </div>
        </div>
        <Chats/>
        <ChatInput></ChatInput>
        </>
        )}
    </div>
}
export default ChatContainer;
const NoChatSelected = ({fullName}) => {
    return (
      <div className='flex justify-center items-center h-full w-full'>
        <h1 className='px-4 text-center sm:text-lg text-gray-200 font-semibold flex flex-col items-center gap-2'>
            <p>Welcome {fullName} </p>
          <p>Select a chat to start messeging</p>
          <TiMessage className='text-3xl md:text-6xl text-center' />
        </h1>
      </div>
    )
  }

