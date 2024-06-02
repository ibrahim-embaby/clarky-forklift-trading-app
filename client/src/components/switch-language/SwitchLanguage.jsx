import i18next from "i18next";
import React, { useEffect, useState } from "react";
import "./switch-language.css";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

function SwitchLanguage() {
  const { i18n } = useTranslation();
  const [toggle, setToggle] = useState(i18n.language);
  const [cookies, setCookies] = useCookies(["i18next"]);

  const changeLanguage = (lang) => {
    setToggle(lang);
    i18next.changeLanguage(lang);
    setCookies("i18next", lang, { path: "/", sameSite: "Lax" });
    localStorage.setItem("lang", lang);
  };

  useEffect(() => {
    if (cookies.i18next && cookies.i18next !== toggle) {
      changeLanguage(cookies.i18next);
    } else if (!cookies.i18next && i18n.language !== toggle) {
      changeLanguage(i18n.language);
    }
  }, [cookies.i18next, toggle]);

  return (
    <div className="switch-language">
      {i18n.language === "ar" ? (
        <button
          className="switch-language-btn"
          onClick={() => changeLanguage("en")}
          aria-label="Switch to English"
        >
          EN
        </button>
      ) : (
        <button
          className="switch-language-btn"
          onClick={() => changeLanguage("ar")}
          aria-label="التبديل إلى العربية"
        >
          ع
        </button>
      )}
    </div>
  );
}

export default SwitchLanguage;
