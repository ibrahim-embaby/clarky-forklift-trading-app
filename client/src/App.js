import { Suspense, useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import UserProfile from "./pages/profile/UserProfile";
import SearchResults from "./pages/search/SearchResults";
import UserProfileSettings from "./pages/profile/UserSettings";
import NotFound from "./pages/not-found/NotFound";
import Admin from "./pages/admin/Admin";
import ContactUs from "./pages/contact-us/ContactUs";
import AccountVerified from "./pages/verify-email/AccountVerified";
import VerifyAccount from "./pages/verify-email/VerifyAccount";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/forgot-password/ResetPassword";
import Ad from "./pages/ad/Ad";
import "./i18n";
import AddAd from "./pages/ad/AddAd";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";
import EditAd from "./pages/ad/EditAd";
import { io } from "socket.io-client";

function Toast() {
  const { i18n } = useTranslation();

  return (
    <Toaster
      position={i18n.language === "ar" ? "bottom-right" : "bottom-left"}
      richColors
      duration={1500}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    />
  );
}
function App() {
  const { user } = useSelector((state) => state.auth);
  const socket = useRef(null);

  useEffect(() => {
    if (user) {
      socket.current = io(process.env.REACT_APP_SERVER_URL, {
        reconnection: true,
        reconnectionDelay: 200,
        reconnectionAttempts: 5,
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket.io server");
        socket.current.emit("addUser", user.id);
      });

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }
  }, [user]);
  return (
    <Suspense fallback={null}>
      <Toast />
      <ToastContainer theme="colored" position="top-center" />
      <Header socket={socket} />
      <Routes>
        <Route path="/account/activate/:token" element={<AccountVerified />} />

        <Route
          path="/"
          element={
            user && !user.isAccountVerified ? <VerifyAccount /> : <Home />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={"/"} /> : <Register />}
        />
        <Route
          path="/profile/:id"
          element={user ? <UserProfile /> : <Navigate to={"/login"} />}
        />
        <Route path="/ads/:id" element={<Ad />} />
        <Route path="/ads/:id/edit" element={user && <EditAd />} />
        <Route path="/sell" element={user && <AddAd />} />
        <Route
          path="/profile/:id/settings"
          element={user ? <UserProfileSettings /> : <Navigate to={"/login"} />}
        />
        <Route path="/search/ads" element={<SearchResults />} />
        <Route path="/about-us" element={<ContactUs />} />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to={"/"} /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={!user ? <ResetPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <Admin socket={socket} />
            ) : user ? (
              <Navigate to={"/"} />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default App;
