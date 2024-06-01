import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdCard from "../../components/ad-card/AdCard";
import { useTranslation } from "react-i18next";
import {
  adminAcceptRefuseAd,
  adminFetchAds,
} from "../../redux/apiCalls/adminApiCalls";
import { toast } from "sonner";

// there will be multiple sections for ads handling, one for pending ads so that admin can accept or remove,
// another one for published ads so that admin can monitor these ads,
// and one for reported ads so that admin can decide what is the action to do
function Ads() {
  const dispatch = useDispatch();
  const { pendingAds } = useSelector((state) => state.admin);
  const { i18n } = useTranslation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedAdId, setSelectedAdId] = useState(null);

  useEffect(() => {
    dispatch(adminFetchAds("pending"));
  }, []);

  const rejectAdHandler = (adId) => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    dispatch(adminAcceptRefuseAd(adId, "rejected", rejectionReason));
  };

  const acceptAdHandler = (adId) => {
    dispatch(adminAcceptRefuseAd(adId, "published"));
  };

  const handleRejectClick = (adId) => {
    if (selectedAdId === adId) {
      setSelectedAdId(null);
    } else {
      setSelectedAdId(adId);
    }
  };
  return (
    <div className="admin-ads">
      {pendingAds.length >= 1 ? (
        pendingAds.map((ad) => (
          <div
            key={ad._id}
            className="admin-ad-wrapper"
            style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
          >
            <AdCard ad={ad} />
            <div className="admin-ad-options">
              <span
                onClick={() => handleRejectClick(ad._id)}
                className="admin-delete-ad-btn"
              >
                رفض
              </span>
              {selectedAdId === ad._id && (
                <div>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason"
                  />
                  <button onClick={() => rejectAdHandler(ad._id)}>
                    Submit Rejection
                  </button>
                </div>
              )}
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
