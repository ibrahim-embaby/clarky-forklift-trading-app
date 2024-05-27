import { Link } from "react-router-dom";
import formatTime from "../../utils/formatTime";
import { useTranslation } from "react-i18next";
// import limitText from "../../utils/limitText";
// import PersonIcon from "@mui/icons-material/Person";
// import CarRepairIcon from "@mui/icons-material/CarRepair";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

function SearchItem({ item }) {
  const { t } = useTranslation();
  return (
    <Link to={`/ads/${item?._id}`} className="search-item">
      <div className="info-wrapper">
        <div className="search-item-img-wrapper">
          <img src={item?.photos[0]} alt="" className="search-item-img" />
        </div>
        <div className="search-item-title">
          <span>{item.title}</span>
        </div>
        <div className="info-items">
          {/* <div className="info-item-wrapper">
            <PersonIcon sx={{ color: "#aaa" }} />
            {limitText(item.username, 10)}
          </div> */}
          <p className="search-item-price">
            {item.price} {t("price_sign")}
          </p>
          <p className="search-item-date">{formatTime(item.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}

export default SearchItem;
