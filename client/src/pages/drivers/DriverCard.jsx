import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import avatar from "../../assets/avatar.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";

function DriverCard({ driver, onSeeMore, onUpdate, onDelete }) {
  const { i18n, t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <div className="driver-card">
      <div className="driver-photo-wrapper">
        <img
          src={driver?.photo?.url || avatar}
          alt={driver?.description}
          className="driver-photo"
        />
      </div>
      <div className="driver-info-wrapper">
        <p className="driver-name">{driver.name}</p>
        <p className="driver-age">
          {t("age")}: {driver.age} {t("year")}
        </p>
        <p className="driver-experience-years">
          {t("experience_years")}: {driver.experienceYears}
        </p>
        <p className="mobile">
          {t("phone")}: {driver.mobile}
        </p>
        <p className="driver-address">
          {t("residence")}:{" "}
          <span className="driver-province">
            {driver.province.label[i18n.language]}
          </span>{" "}
          -{" "}
          <span className="driver-city">
            {driver.city.label[i18n.language]}
          </span>
        </p>
        <p onClick={() => onSeeMore(driver)} className="see-more">
          {t("see_more")}
        </p>
      </div>
      {user && user.id === driver.userId && (
        <div
          className="driver-options-wrapper"
          style={{
            right: i18n.language !== "ar" ? "15px" : "",
            left: i18n.language === "ar" ? "15px" : "",
          }}
        >
          <MoreVertIcon
            onClick={toggleOptions}
            className="driver-options-icon"
          />
          {showOptions && (
            <div className="driver-options-menu">
              <p
                onClick={() => {
                  setShowOptions(false);
                  onUpdate(driver);
                }}
              >
                {t("edit")}
              </p>
              <p
                onClick={() => {
                  setShowOptions(false);
                  onDelete(driver._id);
                }}
              >
                {t("delete")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DriverCard;
