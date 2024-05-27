import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiCalls/authApiCall";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "./forms.css";

function Register() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  document.title = t("register_page_title");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const registerFormHandler = (e) => {
    e.preventDefault();
    if (username.trim() === "") return toast.error("username is empty");
    if (email.trim() === "") return toast.error("email is empty");
    if (mobile.trim() === "") return toast.error("mobile is empty");
    if (mobile.length < 11)
      return toast.error("mobile should be at least 11 characters");
    if (password.trim() === "") return toast.error("password is empty");

    dispatch(registerUser({ email, mobile, password, username }));

    setUsername("");
    setEmail("");
    setMobile("");
    setPassword("");
  };

  return (
    <div
      className="register"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="register-container">
        <div className="form-wrapper">
          <form className="register-form" onSubmit={registerFormHandler}>
            <div className="form-group">
              <div className="form-group-inputs">
                <label htmlFor="username">{t("register_name")}</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />

                <label htmlFor="email">{t("email")}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />

                <label htmlFor="mobile">{t("register_mobile")}</label>
                <input
                  type="text"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="form-input"
                />

                <label htmlFor="password">{t("password")}</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <button className="register-form-btn" type="submit">
              {t("register")}
            </button>
          </form>
        </div>
        <div className="register-background-image"></div>
      </div>
    </div>
  );
}

export default Register;
