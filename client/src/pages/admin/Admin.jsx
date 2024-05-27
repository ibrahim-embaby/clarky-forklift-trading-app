import "./admin.css";
import { useEffect, useState } from "react";
import Users from "./Users";
import Manage from "./Manage";
import Statistics from "./Statistics";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/apiCalls/profileApiCall";
import Ads from "./Ads";
import { useTranslation } from "react-i18next";
import { adminfetchAdsCount } from "../../redux/apiCalls/adminApiCalls";

function Admin() {
  const [currentComponent, setCurrentComponent] = useState(1);

  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.profile);
  const { publishedAdsCount } = useSelector((state) => state.admin);
  const { i18n, t } = useTranslation();
  document.title = t("admin_page_title");

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(adminfetchAdsCount("published"));
  }, [dispatch]);

  return (
    <div className="admin">
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
          <p className="admin-sidebar-text">الورش</p>
        </div>

        <div
          onClick={() => setCurrentComponent(3)}
          style={{ backgroundColor: currentComponent === 3 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">المستخدمين</p>
        </div>

        <div
          onClick={() => setCurrentComponent(4)}
          style={{ backgroundColor: currentComponent === 4 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">الإعلانات</p>
        </div>

        <div
          onClick={() => setCurrentComponent(5)}
          style={{ backgroundColor: currentComponent === 5 && "#ffd1d1da" }}
          className="admin-sidebar-component"
        >
          <p className="admin-sidebar-text">ادارة</p>
        </div>
      </div>
      <div
        className="admin-dashboard"
        style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
      >
        {currentComponent === 1 ? (
          <Statistics usersNumber={users.length} adsCount={publishedAdsCount} />
        ) : currentComponent === 2 ? (
          <Users users={users} />
        ) : currentComponent === 3 ? (
          <Ads />
        ) : (
          <Manage />
        )}
      </div>
    </div>
  );
}

export default Admin;
