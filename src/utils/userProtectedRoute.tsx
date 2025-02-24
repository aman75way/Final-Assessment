import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RecruiterProtected = () => {
  const user = useSelector((state: { auth: { user: { role: string } } }) => state.auth.user);
  return user && user.role === "USER" ? <Outlet /> : <Navigate to="/" />;
};

export default RecruiterProtected;