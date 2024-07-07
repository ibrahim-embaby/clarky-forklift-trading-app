import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import avatar from "../../assets/avatar.png";

const DriverDetailsPanel = ({ driver, onClose }) => {
  const { i18n, t } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (driver) {
      setIsActive(true);
    }
  }, [driver]);

  if (!driver) return null;

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        className={`overlay ${isActive ? "active" : ""}`}
        onClick={handleClose}
      />
      <div className={`driver-details-panel ${isActive ? "active" : ""}`}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <div className="driver-details-header">
          <img
            src={driver?.photo?.url || avatar}
            alt={driver?.description}
            className="driver-details-photo"
          />
          <div className="driver-details-info">
            <h2 className="driver-details-name">{driver.name}</h2>
            <p className="driver-details-meta">
              <span>
                {t("experience_years")}: {driver.experienceYears} {t("year")}
              </span>
              <span>
                {t("age")}: {driver.age} {t("year")}
              </span>
            </p>
          </div>
        </div>
        <div className="driver-details-body">
          <p className="driver-details-contact">
            <strong>{t("phone")}:</strong> {driver.mobile}
          </p>
          <p className="driver-details-address">
            <strong>{t("address")}:</strong>{" "}
            {driver.province.label[i18n.language]} -{" "}
            {driver.city.label[i18n.language]}
          </p>
          <p className="driver-details-desc">
            <strong>{t("description")}:</strong>{" "}
            {driver?.description || t("no_description")}
          </p>
        </div>
      </div>
    </>
  );
};

export default DriverDetailsPanel;
