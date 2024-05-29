import { useTranslation } from "react-i18next";
import "./ad.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteAd, getAd } from "../../redux/apiCalls/adApiCall";
import { Link, useNavigate, useParams } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { Loading } from "../../components/loading/Loading";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fetchMyAd } from "../../redux/apiCalls/profileApiCall";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Ad() {
  const { i18n, t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { currentAd: publishedAd, adLoading } = useSelector(
    (state) => state.ad
  );
  const { ad: userAd, loading } = useSelector((state) => state.profile);
  const [currentAd, setCurrentAd] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [id]);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyAd(id));
    } else {
      dispatch(getAd(id));
    }
  }, [dispatch, user, id]);

  useEffect(() => {
    if (userAd) {
      setCurrentAd(userAd);
    } else if (publishedAd) {
      setCurrentAd(publishedAd);
    }
  }, [userAd, publishedAd]);

  const handleDeleteAd = () => {
    MySwal.fire({
      title: t("confirmation_title"),
      text: t("confirmation_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirmation_btn_text"),
      cancelButtonText: t("confirmation_btn_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAd(id));
        navigate(-1);
      }
    });
  };

  return adLoading || loading ? (
    <Loading />
  ) : (
    <div className="ad">
      <div className="container">
        <div
          className="ad-wrapper"
          style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
        >
          <div className="ad-info-section">
            <div className="ad-photos">
              {currentAd?.photos?.length >= 1 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={true}
                  pagination={{ clickable: true }}
                  key={i18n.language}
                >
                  {currentAd.photos.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} className="ad-photo" alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img src="" alt="" />
              )}
            </div>
            {currentAd?.userId?._id === user?.id && (
              <div className="ad-options">
                <div
                  className="ad-option ad-status"
                  style={{
                    backgroundColor: currentAd?.adStatus?.backgroundColor,
                  }}
                >
                  <p>{t("ad_status")}</p>
                  <p>{currentAd?.adStatus?.label[i18n.language]}</p>
                </div>
                <Link
                  to={`/ads/${currentAd._id}/edit`}
                  className="ad-option ad-edit"
                >
                  <EditIcon />
                  <p>{t("edit")}</p>
                </Link>
                <div className="ad-option ad-delete" onClick={handleDeleteAd}>
                  <DeleteIcon />
                  <p>{t("delete")}</p>
                </div>
              </div>
            )}
            <div className="ad-details">
              <div className="ad-details-top">
                <div className="ad-title">{currentAd?.title}</div>
                <div className="ad-price">
                  {currentAd?.price}
                  {t("price_sign")}
                </div>
              </div>
              <div className="ad-details-bottom">
                <div className="ad-address">
                  <PlaceIcon />
                  {currentAd?.province?.label[i18n.language]} -{" "}
                  {currentAd?.city?.label[i18n.language]}
                </div>
                <div className="ad-duration">
                  <CalendarTodayIcon />
                  {formatTime(currentAd?.createdAt)}
                </div>
              </div>
            </div>
            <div className="ad-specifications">
              <h3>
                <InfoIcon />
                {t("details")}
              </h3>
              <table className="rotated-table">
                <tbody>
                  <tr>
                    <th>{t("condition")}</th>
                    <td>{currentAd?.status?.label[i18n.language]}</td>
                  </tr>
                  <tr>
                    <th>{t("purpose")}</th>
                    <td>{currentAd?.saleOrRent?.label[i18n.language]}</td>
                  </tr>
                  <tr>
                    <th>{t("quantity")}</th>
                    <td>{currentAd?.quantity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="ad-description">
              <h3>{t("description")}</h3>
              <p>{currentAd?.description}</p>
            </div>
          </div>
          <div className="contact-info-section">
            <div className="contact-info-wrapper">
              <h3 className="contact-info-title">{t("seller_info")}</h3>
              <div className="contact-info">
                <div className="seller-name">{currentAd?.userId?.username}</div>
                <div className="seller-profile">
                  {t("see_all_seller_ads")}
                  {currentAd?.userId.username}
                  {">"}
                </div>
                <div className="seller-mobile">
                  {currentAd?.phone}
                  <LocalPhoneIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ad;
