import { Navigate, useLocation   } from "react-router-dom";

const CheckAuth = ({ authUser, authToken, children }) => {
    console.log("authUser in checkAuth",authUser);
    console.log("authToken in checkAuth",authToken);
  const location = useLocation();
  if (!authUser && !authToken) {
    if(location.pathname ==="/"){
      return <Navigate to="/login" replace />;
    }
  }
  if(authToken && authUser){
    if(location.pathname === "/login" || location.pathname === "/register"){
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default CheckAuth;
