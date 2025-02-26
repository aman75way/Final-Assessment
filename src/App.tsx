import HomePage from "./pages/homepage";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useLoadingBar } from "react-top-loading-bar";
import ResumeBuilder from "./pages/resumebuilder";
import RecommendedJobs from "./pages/recommendedjobs";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const { start, complete } = useLoadingBar({
    color: "#000000",
    height: 3,
  });
  const location = useLocation();


  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      complete();
    }
  }, [isLoading, start, complete]);


  useEffect(() => {
    start();
    return () => complete();
  }, [location.pathname, start, complete]);


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
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes for Users */}
        <Route element={<UserProtected />}>
          <Route path="/applications" element={<UserApplications />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/recommended-jobs" element={<RecommendedJobs />} />
        </Route>

        {/* Protected Routes for Recruiters */}
        <Route element={<RecruiterProtected />}>
          <Route path="/recruiter" element={<RecruiterPage />} />
          <Route path="/recruiter/applications" element={<RecruiterApplications />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
};

export default App;
