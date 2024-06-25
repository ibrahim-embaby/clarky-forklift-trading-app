import "./footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useTranslation } from "react-i18next";
function Footer() {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <div className="footer-left">{t("footer_title")}</div>
      <div className="footer-right">
        <a
          href="https://www.facebook.com/clarky.eg"
          target="_blank"
          className="footer-right-icon facebook"
        >
          <FacebookIcon sx={{ fontSize: 35 }} />
        </a>
      </div>
    </div>
  );
}

export default Footer;
