import "./forms.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiCalls/authApiCall";
import { useTranslation } from "react-i18next";
import LoginForm from "./LoginForm";
import { toast } from "sonner";

function Login() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  document.title = t("login_page_title");

  const loginFormHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    if (payload?.email === "") return toast.error("please enter your email");
    if (payload?.password === "")
      return toast.error("please enter your password");

    dispatch(loginUser(payload));
  };

  return (
    <div
      className="login"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="login-container">
        <div className="form-wrapper">
          <LoginForm loginFunc={loginFormHandler} />
        </div>
        <div className="login-background-image"></div>
      </div>
    </div>
  );
}

export default Login;
