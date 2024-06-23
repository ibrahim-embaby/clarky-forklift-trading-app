import "./footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import { useTranslation } from "react-i18next";
function Footer() {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <div className="footer-left">{t("footer_title")}</div>
      <div className="footer-right">
        <p className="footer-right-icon facebook">
          <FacebookIcon sx={{ fontSize: 35 }} />
        </p>
        <p className="footer-right-icon instagram">
          <Instagram sx={{ fontSize: 35 }} />
        </p>
      </div>
    </div>
  );
}

export default Footer;
