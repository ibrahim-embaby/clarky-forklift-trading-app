import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import CreateIcon from "@mui/icons-material/Create";
import "./header.css";

function HeaderLeft() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleCreateAd = () => {
    if (user) {
      navigate("/sell");
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
    </div>
  );
}

export default HeaderLeft;
