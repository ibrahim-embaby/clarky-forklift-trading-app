import "./account-verification.css";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { sendVerificationMail } from "../../redux/apiCalls/authApiCall";
import { useTranslation } from "react-i18next";

function VerifyAccount() {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const sendAnotherVerificationMail = () => {
    dispatch(
      sendVerificationMail(user?.email, user.workshopName ? "mechanic" : "user")
    );
  };
  return user?.isAccountVerified ? (
    <Navigate to={"/"} />
  ) : (
    <div className="verify-account">
      <p>{t("verify_account")}</p>
      <p
        onClick={sendAnotherVerificationMail}
        style={{ textDecoration: "underline", color: "red", cursor: "pointer" }}
      >
        {t("send_another_link")}
      </p>
    </div>
  );
}

export default VerifyAccount;
