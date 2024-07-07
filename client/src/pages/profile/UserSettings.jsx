import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/apiCalls/profileApiCall";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

function UserProfileSettings() {
  const currentUser = useSelector((state) => state.auth.user);

  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    bio: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setInitialData(currentUser);
    setFormData({
      username: currentUser.username || "",
      mobile: currentUser.mobile || "",
      bio: currentUser.bio || "",
    });
    setProfilePhoto(null);
  }, [dispatch, currentUser.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleUserSettingsForm = (e) => {
    e.preventDefault();

    const profilePhotoData = new FormData();
    if (profilePhoto) {
      profilePhotoData.append("profilePhoto", profilePhoto);
    }
    const updatedFields = {};

    for (const key in formData) {
      if (formData[key] !== initialData[key]) {
        updatedFields[key] = formData[key];
      }
    }

    if (
      !("username" in updatedFields) &&
      !("mobile" in updatedFields) &&
      !("bio" in updatedFields) &&
      !profilePhotoData.has("profilePhoto")
    ) {
      return toast.warning(t("edit_one_field_at_least"));
    }

    if (!formData["username"]) {
      return toast.warning(t("username field can't be empty"));
    }

    if (!formData["mobile"]) {
      return toast.warning(t("mobile field can't be empty"));
    }

    dispatch(updateUserProfile(updatedFields, profilePhotoData));
  };

  return (
    <div
      className="user-profile-settings"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="settings-card">
        <h2 className="settings-title">{t("user_settings_title")}</h2>
        <form onSubmit={handleUserSettingsForm} className="settings-form">
          <div className="profile-photo-section">
            <div className="photo-upload-wrapper">
              <label htmlFor="photo-upload" className="photo-upload-label">
                {profilePhoto ? (
                  <img
                    src={URL.createObjectURL(profilePhoto)}
                    alt="Profile"
                    className="profile-photo"
                  />
                ) : (
                  <div className="photo-placeholder">
                    <span className="photo-icon">
                      <CameraAltIcon
                        sx={{
                          fontSize: "48px",
                        }}
                      />
                    </span>
                  </div>
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-upload-input"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label htmlFor="bio">{t("user_settings_bio")}</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="settings-form-input settings-form-bio"
            />
          </div>

          <div className="settings-form-group">
            <label htmlFor="username">{t("user_settings_name")}</label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              type="text"
              placeholder={t("user_settings_name_placeholder")}
              className="settings-form-input"
            />
          </div>

          <div className="settings-form-group">
            <label htmlFor="mobile">{t("user_settings_mobile")}</label>
            <input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              type="text"
              placeholder={t("user_settings_mobile_placeholder")}
              className="settings-form-input"
            />
          </div>

          <button type="submit" className="settings-form-btn">
            {t("edit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfileSettings;
