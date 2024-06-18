import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiCalls/authApiCall";
import { useState } from "react";
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!username.trim()) errors.username = t("username_required");
    if (!email.trim()) errors.email = t("email_required");
    if (!mobile || !/^(010|011|012|015)\d{8}$/.test(mobile))
      errors.mobile = t("phone_validation");
    if (!password.trim()) errors.password = t("password_required");

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const registerFormHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(registerUser({ email, mobile, password, username }));

    setUsername("");
    setEmail("");
    setMobile("");
    setPassword("");
    setErrors({});
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
                <div className="register-form-group-input-wrapper">
                  <label htmlFor="username">{t("register_name")}*</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                  {errors.username && (
                    <span className="error">{errors.username}</span>
                  )}
                </div>

                <div className="register-form-group-input-wrapper">
                  <label htmlFor="email">{t("email")}*</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>

                <div className="register-form-group-input-wrapper">
                  <label htmlFor="mobile">{t("register_mobile")}*</label>
                  <input
                    type="text"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="form-input"
                  />
                  {errors.mobile && (
                    <span className="error">{errors.mobile}</span>
                  )}
                </div>

                <div className="register-form-group-input-wrapper">
                  <label htmlFor="password">{t("password")}*</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                  {errors.password && (
                    <span className="error">{errors.password}</span>
                  )}
                </div>
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
