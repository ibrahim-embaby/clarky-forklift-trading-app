import { useTranslation } from "react-i18next";
import "./ad.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAd } from "../../redux/apiCalls/adApiCall";
import { useParams } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { Loading } from "../../components/loading/Loading";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

function Ad() {
  const { i18n, t } = useTranslation();
  const { currentAd, adLoading } = useSelector((state) => state.ad);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAd(id));
  }, [id]);

  return adLoading ? (
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
                  {currentAd?.province?.label[i18n.language]} -{" "}
                  {currentAd?.city?.label[i18n.language]}
                </div>
                <div className="ad-duration">
                  {formatTime(currentAd?.createdAt)}
                </div>
              </div>
            </div>
            <div className="ad-sepcifications">
              <h3>{t("Details")}</h3>
              <table className="rotated-table">
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
              </table>
            </div>
            <div className="ad-description">
              <h3>{t("description")}</h3>
              <p>{currentAd?.description}</p>
            </div>
            {/* <div className="ad-location">
              <h3>الموقع علي الخريطة</h3>
            </div> */}
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
