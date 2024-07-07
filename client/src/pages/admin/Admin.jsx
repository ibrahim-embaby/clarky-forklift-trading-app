import "./admin.css";
import { useState } from "react";
import Users from "./Users";
import Manage from "./Manage";
import Statistics from "./Statistics";
import Ads from "./Ads";
import { useTranslation } from "react-i18next";
import Drivers from "./Drivers";

function Admin({ socket }) {
  const [currentComponent, setCurrentComponent] = useState(1);

  const { i18n, t } = useTranslation();
  document.title = t("admin_page_title");

  return (
    <div
      className="admin"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="admin-sidebar">
        <div
          onClick={() => setCurrentComponent(1)}
          style={{ backgroundColor: currentComponent === 1 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">احصائيات</p>
        </div>

        <div
          onClick={() => setCurrentComponent(2)}
          style={{ backgroundColor: currentComponent === 2 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">المستخدمين</p>
        </div>

        <div
          onClick={() => setCurrentComponent(3)}
          style={{ backgroundColor: currentComponent === 3 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">الإعلانات</p>
        </div>

        <div
          onClick={() => setCurrentComponent(4)}
          style={{ backgroundColor: currentComponent === 4 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">السائقين</p>
        </div>

        <div
          onClick={() => setCurrentComponent(5)}
          style={{ backgroundColor: currentComponent === 5 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">ادارة</p>
        </div>
      </div>
      <div className="admin-dashboard">
        {currentComponent === 1 ? (
          <Statistics />
        ) : currentComponent === 2 ? (
          <Users />
        ) : currentComponent === 3 ? (
          <Ads socket={socket} />
        ) : currentComponent === 4 ? (
          <Drivers />
        ) : (
          <Manage />
        )}
      </div>
    </div>
  );
}

export default Admin;
