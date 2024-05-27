// import DeleteIcon from "@mui/icons-material/Delete";
import "./ad-card.css";
import limitText from "../../utils/limitText";
import formatTime from "../../utils/formatTime";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
function AdCard({ ad }) {
  return (
    <Link className="ad-card" to={`/ads/${ad?._id}`}>
      <div className="ad-item">
        <p className="ad-item-info">
          <span className="ad-item-info-name-wrapper">
            <PersonIcon sx={{ color: "#333" }} />
            {limitText(ad?.userId?.username, 10)}
          </span>
        </p>
        <p className="ad-item-text">{ad?.title}</p>
        <div className="ad-item-date-wrapper">
          <p className="ad-item-date">{formatTime(ad?.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}

export default AdCard;
