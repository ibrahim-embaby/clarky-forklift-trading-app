import "./header.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import CreateIcon from "@mui/icons-material/Create";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function HeaderLeft({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateAd = () => {
    if (user) {
      navigate("/sell");
    } else {
      toast.info(t("login_required"));
    }
  };

  const handleCreateDriverClick = () => {
    if (user) {
      navigate("/add-driver");
    } else {
      toast.info(t("login_required"));
    }
  };

  return (
    <div className="header-left">
      <Link to="/" className="site-name">
        {t("header_title")}
      </Link>
      <div className="navbar-sell" onClick={handleCreateAd}>
        <CreateIcon sx={{ fontSize: "20px" }} />
        {t("navbar_sell")}
      </div>
      <div className="navbar-driver-join" onClick={handleCreateDriverClick}>
        <PersonAddIcon sx={{ fontSize: "20px" }} />
        {t("navbar_driver_join")}
      </div>
    </div>
  );
}

export default HeaderLeft;
