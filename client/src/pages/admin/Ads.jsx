import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdCard from "../../components/ad-card/AdCard";
import { useTranslation } from "react-i18next";
import {
  adminAcceptRefuseAd,
  adminFetchAds,
} from "../../redux/apiCalls/adminApiCalls";

// there will be multiple sections for ads handling, one for pending ads so that admin can accept or remove,
// another one for published ads so that admin can monitor these ads,
// and one for reported ads so that admin can decide what is the action to do
function Ads() {
  const dispatch = useDispatch();
  const { pendingAds } = useSelector((state) => state.admin);
  const { i18n } = useTranslation();

  useEffect(() => {
    dispatch(adminFetchAds("pending"));
  }, []);

  const deleteAdHandler = (adId) => {
    dispatch(adminAcceptRefuseAd(adId, "blocked"));
  };

  const acceptAdHandler = (adId) => {
    dispatch(adminAcceptRefuseAd(adId, "published"));
  };
  return (
    <div className="admin-ads">
      {pendingAds.length ? (
        pendingAds.map((ad) => (
          <div
            className="admin-ad-wrapper"
            style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
          >
            <AdCard ad={ad} />
            <div className="admin-ad-options">
              <span
                onClick={() => deleteAdHandler(ad._id)}
                className="admin-delete-ad-btn"
              >
                حذف
              </span>
              <span
                onClick={() => acceptAdHandler(ad._id)}
                className="admin-accept-ad-btn"
              >
                موافقة
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>لا توجد اعلانات</p>
      )}
    </div>
  );
}

export default Ads;
