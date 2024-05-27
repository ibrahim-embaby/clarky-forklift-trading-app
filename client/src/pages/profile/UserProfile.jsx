import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/apiCalls/profileApiCall";
import { useParams } from "react-router-dom";
import "./profile.css";

import { useTranslation } from "react-i18next";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  document.title = t("user_profile_page_title");

  useEffect(() => {
    dispatch(fetchUserProfile(id));
  }, [id]);

  return (
    <div
      className="profile"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="profile-top">{user.username}</div>
      <div className="container">
        <div className="profile-bottom">
          <div className="profile-bottom-right">
            <h2>{t("profile_favorites")}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
