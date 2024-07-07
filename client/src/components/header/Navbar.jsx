import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

function Navbar({ toggle, setToggle, user }) {
  const [currentTab, setCurrentTab] = useState(1);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const selectedTabColor = "var(--primary-color)";

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setCurrentTab(1);
        break;
      case "/search/ads":
        setCurrentTab(2);
        break;
      case "/drivers":
        setCurrentTab(3);
        break;
      case "/admin":
        setCurrentTab(4);
        break;
      case "/login":
        setCurrentTab(5);
        break;
      case "/register":
        setCurrentTab(6);
        break;
      default:
        setCurrentTab(0);
    }
  }, [location.pathname]);

  return (
    <nav
      style={{
        clipPath: toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
      className={`navbar ${toggle ? "open" : ""}`}
    >
      <ul>
        <li>
          <Link
            to="/"
            onClick={() => {
              setCurrentTab(1);
              setToggle(false);
            }}
            style={{
              color: currentTab === 1 ? selectedTabColor : "",
              fontWeight: currentTab === 1 ? "bolder" : "",
            }}
          >
            {t("navbar_main")}
          </Link>
        </li>
        <li>
          <Link
            to="/search/ads"
            onClick={() => {
              setCurrentTab(2);
              setToggle(false);
            }}
            style={{
              color: currentTab === 2 ? selectedTabColor : "",
              fontWeight: currentTab === 2 ? "bolder" : "",
            }}
          >
            {t("navbar_search")}
          </Link>
        </li>
        <li>
          <Link
            to="/drivers"
            onClick={() => {
              setCurrentTab(3);
              setToggle(false);
            }}
            style={{
              color: currentTab === 3 ? selectedTabColor : "",
              fontWeight: currentTab === 3 ? "bolder" : "",
            }}
          >
            {t("navbar_drivers")}
          </Link>
        </li>
        {user?.role === "admin" && (
          <li>
            <Link
              to="/admin"
              onClick={() => {
                setCurrentTab(4);
                setToggle(false);
              }}
              style={{
                color: currentTab === 4 ? selectedTabColor : "",
                fontWeight: currentTab === 4 ? "bolder" : "",
              }}
            >
              {t("navbar_admin")}
            </Link>
          </li>
        )}
        {!user && (
          <li className="nav-auth-links">
            <Link
              to="/login"
              onClick={() => {
                setCurrentTab(5);
                setToggle(false);
              }}
              className="login-button auth-link"
              style={{
                color: currentTab === 5 ? selectedTabColor : "",
                fontWeight: currentTab === 5 ? "bolder" : "",
              }}
            >
              {t("login")}
            </Link>
            <Link
              to="/register"
              onClick={() => {
                setCurrentTab(6);
                setToggle(false);
              }}
              className="register-button auth-link"
              style={{
                color: currentTab === 6 ? selectedTabColor : "",
                fontWeight: currentTab === 6 ? "bolder" : "",
              }}
            >
              {t("register")}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
