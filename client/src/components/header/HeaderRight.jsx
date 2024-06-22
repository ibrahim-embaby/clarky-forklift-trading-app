import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/apiCalls/authApiCall";
import ArrowDropDown from "@mui/icons-material/KeyboardArrowDown";
import SwitchLanguage from "../switch-language/SwitchLanguage";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import limitText from "../../utils/limitText.js";
import { useTranslation } from "react-i18next";
import "./header.css";
import avatar from "../../assets/avatar.png";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import formatTime from "../../utils/formatTime";
import { Loading } from "../loading/Loading.jsx";
import {
  fetchAllNotifications,
  readNotifications,
} from "../../redux/apiCalls/notificationApiCalls";
import { v4 as uuidv4 } from "uuid";

function HeaderRight({ toggle, setToggle, user, socket }) {
  const dispatch = useDispatch();
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [userNotifications, setUserNotifications] = useState([]);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const { notifications, notificationsCount, loading } = useSelector(
    (state) => state.notification
  );
  const [page, setPage] = useState(0);

  const handleLogoutUser = () => {
    setToggleMenu(false);
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchAllNotifications(1, 10));
    }
  }, [user]);

  useEffect(() => {
    if (socket && socket.current) {
      console.log("Setting up socket event listeners");

      const handleNotification = () => {
        setUnreadNotificationsCount((prev) => prev + 1);
      };

      socket.current.on("getNotificationAlert", handleNotification);

      return () => {
        console.log("Cleaning up socket event listeners");
        socket.current.off("getNotificationAlert", handleNotification);
      };
    } else {
      console.log("Socket not available");
    }
  }, [socket]);

  useEffect(() => {
    if (notifications.length) {
      setUserNotifications(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleMenu(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setToggleNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("beforeunload", () => setToggleMenu(false));
    window.addEventListener("beforeunload", () =>
      setToggleNotifications(false)
    );
    setPage(1);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("beforeunload", () => setToggleMenu(false));
      window.removeEventListener("beforeunload", () =>
        setToggleNotifications(false)
      );
    };
  }, []);

  useEffect(() => {
    const count = userNotifications.filter((n) => n.isRead === false).length;
    setUnreadNotificationsCount(count);
  }, [userNotifications]);

  const handleOpenNotifications = () => {
    setToggleNotifications((prev) => !prev);
    const notificationIds = userNotifications.map(
      (notification) => notification._id
    );
    if (toggleNotifications === false) {
      dispatch(readNotifications(notificationIds));
    }
  };

  const handleLoadMore = (event) => {
    event.stopPropagation();
    setPage((prev) => prev + 1);
    dispatch(fetchAllNotifications(page + 1, 10));
  };

  return (
    <div className="header-right">
      <SwitchLanguage />
      {user && (
        <div
          className="notification-wrapper"
          style={{
            backgroundColor: toggleNotifications && "#f0f0f0",
          }}
          onClick={handleOpenNotifications}
          ref={notificationsRef}
        >
          <div className="notification-icon">
            <NotificationsNoneIcon />
            {unreadNotificationsCount > 0 && (
              <span className="unread-notifications-number">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <div
            className="user-notifications"
            style={{
              display: toggleNotifications ? "flex" : "none",
              justifyContent: !userNotifications.length && "center",
            }}
          >
            {loading ? (
              <Loading />
            ) : userNotifications.length > 0 ? (
              <>
                {userNotifications.map((notification) => (
                  <Link
                    to={`ads/${notification.adId._id}`}
                    key={notification._id || uuidv4()}
                    className="user-notifications-item"
                    style={{
                      direction: i18n.language === "ar" ? "rtl" : "ltr",
                      backgroundColor: !notification.isRead && "#eee",
                    }}
                  >
                    <p
                      className="user-notifications-item-title"
                      style={{
                        backgroundColor:
                          notification.type === "adAccepted"
                            ? "#28a745"
                            : "#f44336",
                      }}
                    >
                      {notification.content[i18n.language]}
                    </p>
                    <p className="user-notifications-item-ad">
                      {limitText(notification.adId?.title, 50)}
                    </p>
                    <p className="user-notifications-item-date">
                      {formatTime(notification.createdAt)}
                    </p>
                  </Link>
                ))}
                {userNotifications.length < notificationsCount && (
                  <button onClick={handleLoadMore} className="load-more-button">
                    {t("load_more")}
                  </button>
                )}
              </>
            ) : (
              <p className="user-no-notifications">{t("no_notifications")}</p>
            )}
          </div>
        </div>
      )}
      {user ? (
        <div
          className="user-settings"
          onClick={() => setToggleMenu(!toggleMenu)}
          ref={menuRef}
        >
          <ArrowDropDown size="medium" />
          <p style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}>
            {limitText(user.username, 10)}
          </p>
          <div
            className="user-menu"
            style={{ display: toggleMenu ? "flex" : "none" }}
          >
            <Link
              to={`/profile/${user.id}`}
              onClick={() => setToggleMenu(false)}
              className="user-menu-item"
            >
              {t("my_ads")}
            </Link>
            <Link
              to={`/profile/${user.id}/settings`}
              onClick={() => setToggleMenu(false)}
              className="user-menu-item"
            >
              {t("dropdown_settings")}
            </Link>
            <p
              className="user-menu-item"
              onClick={handleLogoutUser}
              style={{ borderBottom: "none" }}
            >
              {t("logout")}
            </p>
          </div>
        </div>
      ) : (
        <div className="header-auth-links">
          <Link to="/login" className="login-button auth-link">
            {t("login")}
          </Link>
          <Link to="/register" className="register-button auth-link">
            {t("register")}
          </Link>
        </div>
      )}
      <div className="header-menu" onClick={() => setToggle((prev) => !prev)}>
        {toggle ? (
          <CloseIcon
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: 30,
              cursor: "pointer",
            }}
          />
        ) : (
          <MenuIcon
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: 30,
              cursor: "pointer",
            }}
          />
        )}
      </div>
      {user && (
        <Link to={`/profile/${user.id}`} className="header-user-image">
          <img src={user?.profilePhoto?.url || avatar} alt="" />
        </Link>
      )}
    </div>
  );
}

export default HeaderRight;
