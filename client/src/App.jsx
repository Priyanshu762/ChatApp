import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppRouter from './Router/AppRouter.jsx';
import Spinner from './components/common/Spinner';
import { initializeAuth } from './store/slices/authSlice';
import { getFriendRequests } from './store/slices/chatSlice.js';

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);
  const authUser = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  useEffect(()=>{
    dispatch(getFriendRequests())
  },[dispatch])
  
  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
