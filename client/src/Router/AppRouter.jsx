import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { useSelector } from "react-redux";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import CheckAuth from "../components/common/CheckAuth";
import Navbar from "../components/Navbar";

const AppRouter = () => {

  const authUser = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);
  return (
    <Router>

      <Navbar></Navbar>
      <div className="h-[93vh]">
        <Routes>
          <Route path="/login" element={
            <CheckAuth authUser={authUser} authToken={authToken}>
              <Login />
            </CheckAuth>
          } />
          <Route path="/register" element={
            <CheckAuth authUser={authUser} authToken={authToken}>
              <Register />
            </CheckAuth>
          } />
          <Route path="/" element={
            <CheckAuth authUser={authUser} authToken={authToken}>
              <Chat />
            </CheckAuth>
          } />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
