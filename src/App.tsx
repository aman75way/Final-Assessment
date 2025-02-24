import HomePage from "./pages/homepage";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/loginpage";
import SignUp from "./pages/singuppage";
import RecruiterPage from "./pages/recruiterpage";
import UserProtected from "./utils/userProtectedRoute";
import RecruiterProtected from "./utils/recruiterProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserApplications from "./pages/userapplicationpage";
import RecruiterApplications from "./pages/recruiterapplicationpage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "./services/supabase";
import { userUpdate } from "./store/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;

      const email = data.user.email;
      if (!email) return;

      const { data: dbUserData, error: dbUserError } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

      if (dbUserError || !dbUserData) return;

      dispatch(
        userUpdate({
          id: dbUserData.id,
          name: dbUserData.name,
          role: dbUserData.role,
          resumeURL: dbUserData.resumeURL,
          skills: dbUserData.skills,
          email,
        })
      );
    };

    fetchUser();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/recruiter" element={<RecruiterProtected />}>
        <Route path="" element={<RecruiterPage />} />
        </Route>
        <Route path="/applications" element={<UserProtected />}>
        <Route path="" element={<UserApplications />} />
        </Route>
        <Route path="/recruiter/applications" element={<RecruiterProtected />}>
        <Route path="" element={<RecruiterApplications />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
