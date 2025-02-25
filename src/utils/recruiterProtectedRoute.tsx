import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const RecruiterProtected = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user && user.role === "RECRUITER" ? <Outlet /> : <Navigate to="/" />;
};

export default RecruiterProtected;