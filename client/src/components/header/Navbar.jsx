import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

function Navbar({ toggle, setToggle }) {
  const { user } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState(1);
  const location = useLocation();
  const { t } = useTranslation();
  const selectedTabColor = "var(--primary-color)";

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setCurrentTab(1);
        break;
      case "/search/ads":
        setCurrentTab(2);
        break;
      case "/admin":
        setCurrentTab(3);
        break;
      case "/login":
        setCurrentTab(4);
        break;
      case "/register":
        setCurrentTab(5);
        break;
      default:
        setCurrentTab(0);
    }
  }, [location.pathname]);

  return (
    <nav
      style={{
        clipPath: toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
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
        {user?.role === "admin" && (
          <li>
            <Link
              to="/admin"
              onClick={() => {
                setCurrentTab(3);
                setToggle(false);
              }}
              style={{
                color: currentTab === 3 ? selectedTabColor : "",
                fontWeight: currentTab === 3 ? "bolder" : "",
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
                setCurrentTab(4);
                setToggle(false);
              }}
              className="login-button auth-link"
              style={{
                color: currentTab === 4 ? selectedTabColor : "",
                fontWeight: currentTab === 4 ? "bolder" : "",
              }}
            >
              {t("login")}
            </Link>
            <Link
              to="/register"
              onClick={() => {
                setCurrentTab(5);
                setToggle(false);
              }}
              className="register-button auth-link"
              style={{
                color: currentTab === 5 ? selectedTabColor : "",
                fontWeight: currentTab === 5 ? "bolder" : "",
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
