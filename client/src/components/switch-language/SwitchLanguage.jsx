import i18next from "i18next";
import React, { useEffect, useState } from "react";
import "./switch-language.css";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

function SwitchLanguage() {
  const initialLang = localStorage.getItem("lang") || "ar";
  const { i18n } = useTranslation();
  const [toggle, setToggle] = useState(initialLang);
  const [cookies, setCookies] = useCookies(["i18next"]);

  const changeLanguage = (lang) => {
    setToggle(lang);
    i18next.changeLanguage(lang);
    setCookies("i18next", lang, { path: "/" });
    localStorage.setItem("lang", lang);
    i18n.init({ lng: lang });
  };

  useEffect(() => {
    // Initialize language on component mount
    if (cookies.i18next !== toggle) {
      changeLanguage(toggle);
    }
  }, [cookies, toggle]);

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
