import { Suspense } from "react";
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

  return (
    <Suspense fallback={null}>
      <Toast />
      <ToastContainer theme="colored" position="top-center" />
      <Header />
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
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/ads/:id" element={<Ad />} />
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
              <Admin />
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
