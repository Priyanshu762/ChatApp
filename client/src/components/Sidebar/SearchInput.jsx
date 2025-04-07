import { useState } from 'react';
import { useSelector } from 'react-redux';
import {IoSearchSharp} from 'react-icons/io5';
import { setSelectedChat } from '../../store/slices/chatSlice';
const SearchInput=()=>{

    const [searchQuery, setSearchQuery] = useState('');
    const selectedChat = useSelector((state) => state.chat.selectedChat);
    const friends = useSelector((state) => state.chat.friends);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // const friend = friends.find(friend => friend.username === searchQuery);
        // if (friend) {
        //     dispatch(setSelectedChat(friend));
        // }
        if(!searchQuery){
          return
        }
        if(searchQuery.length<3){
          return toast.error("Search query must be at least 3 characters long");
        }
        const friend = friends.find((c)=>c.username.toLowerCase().includes(searchQuery.toLowerCase()));
        if(friend){
          dispatch(setSelectedChat(friend));
          setSearchQuery('');
        }
        console.log("Search query:", searchQuery);
    }
  return(
    <form onSubmit={handleSubmit}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1">
        <input
          type="text"
          placeholder="Search friends..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type='submit' className='btn btn-circle  text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>
      </div>
    </form>
  )
}

export default SearchInput;
