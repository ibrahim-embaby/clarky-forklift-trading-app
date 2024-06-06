import { Link } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { useTranslation } from "react-i18next";
import limitText from "../../utils/limitText";

function SearchItem({ item }) {
  const { t, i18n } = useTranslation();
  return (
    <Link to={`/ads/${item?._id}`} className="search-item">
      <div
        className="search-item-card"
        style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      >
        <div className="search-item-img-wrapper">
          <img
            src={item?.photos[0]}
            alt={item.title}
            className="search-item-img"
          />
        </div>
        <div className="search-item-info">
          <p className="search-item-price">
            {item.price} {t("price_sign")}
          </p>
          <h3 className="search-item-title">{limitText(item.title, 30)}</h3>
          <div className="search-item-bottom">
            <p className="search-item-address">
              {item.province.label[i18n.language]} -{" "}
              {item.city.label[i18n.language]}
            </p>
            <p className="search-item-date">{formatTime(item.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchItem;
