import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RecruiterProtected = () => {
  const user = useSelector((state: { auth: { user: User } }) => state.auth.user);
  return user && user.role === "RECRUITER" ? <Outlet /> : <Navigate to="/" />;
};

export default RecruiterProtected;