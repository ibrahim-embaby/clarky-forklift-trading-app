import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { fetchProvinces } from "../../redux/apiCalls/controlsApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { createDriver } from "../../redux/apiCalls/driverApiCalls";

const AddDriver = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { provinces } = useSelector((state) => state.controls);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    experienceYears: 0,
    mobile: user.mobile,
    province: "",
    city: "",
    description: "",
  });
  const [driverPhoto, setDriverPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handlePhotoChange = (e) => {
    const photo = e.target.files[0];
    setDriverPhoto(photo);
    validateField("driverPhoto", photo);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createDriver(formData, driverPhoto));
      setFormData({
        name: "",
        age: 0,
        experienceYears: 0,
        mobile: "",
        province: "",
        city: "",
        description: "",
      });
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "name" && value.length < 3) {
      errorMsg = t("name_validation_error");
    }
    if (name === "age" && (value < 18 || value > 90)) {
      errorMsg = t("age_validation_error");
    }
    if (name === "experienceYears" && value < 0) {
      errorMsg = t("experience_validation_error");
    }
    if (name === "mobile" && !/^01[0125][0-9]{8}$/.test(value)) {
      errorMsg = t("mobile_validation_error");
    }
    if (name === "driverPhoto" && !value) {
      errorMsg = t("photo_validation_error");
    }
    setErrors((prevState) => ({
      ...prevState,
      [name]: errorMsg,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (formData.name.length < 3) {
      formErrors.name = t("name_validation_error");
    }
    if (formData.age < 18 || formData.age > 90) {
      formErrors.age = t("age_validation_error");
    }
    if (!/^01[0125][0-9]{8}$/.test(formData.mobile)) {
      formErrors.mobile = t("mobile_validation_error");
    }
    if (formData.experienceYears < 0) {
      formErrors.experienceYears = t("experience_validation_error");
    }
    if (!driverPhoto) {
      formErrors.driverPhoto = t("photo_validation_error");
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  return (
    <div
      className="add-driver"
      style={{
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
    >
      <div className="add-driver-form-card">
        <h2 className="add-driver-form-title">{t("join_driver")}</h2>
        <form onSubmit={handleFormSubmit} className="add-driver-form-content">
          <div className="add-driver-photo-section">
            <div className="add-driver-photo-upload-wrapper">
              <label
                htmlFor="photo-upload"
                className="add-driver-photo-upload-label"
              >
                {driverPhoto ? (
                  <img
                    src={URL.createObjectURL(driverPhoto)}
                    alt="Driver"
                    className="add-driver-photo"
                  />
                ) : (
                  <div className="add-driver-photo-placeholder">
                    <span className="add-driver-photo-icon">
                      <CameraAltIcon sx={{ fontSize: "48px" }} />
                    </span>
                  </div>
                )}
              </label>

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="add-driver-photo-upload-input"
              />
              <span>{t("personal_photo")}</span>
              {errors.driverPhoto && (
                <span className="error">{errors.driverPhoto}</span>
              )}
            </div>
          </div>

          <div className="add-driver-form-group">
            <label htmlFor="name">{t("name")}</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              type="text"
              className="add-driver-form-input"
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="add-driver-form-group">
            <label htmlFor="age">{t("age")}</label>
            <input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              onWheel={(e) => e.target.blur()}
              type="number"
              className="add-driver-form-input"
              min={0}
              required
            />
            {errors.age && <span className="error">{errors.age}</span>}
          </div>

          <div className="add-driver-form-group">
            <label htmlFor="experienceYears">{t("experience_years")}</label>
            <input
              id="experienceYears"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              onWheel={(e) => e.target.blur()}
              type="number"
              className="add-driver-form-input"
              min={0}
              required
            />
            {errors.experienceYears && (
              <span className="error">{errors.experienceYears}</span>
            )}
          </div>

          <div className="add-driver-form-group">
            <label htmlFor="mobile">{t("phone")}</label>
            <input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              type="text"
              className="add-driver-form-input"
              required
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          <div>
            <label htmlFor="province">{t("address")}</label>

            <div className="add-driver-form-group add-driver-address">
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="add-driver-form-input add-driver-address-select"
                required
              >
                <option value="" disabled>
                  {t("province")}
                </option>
                {provinces.map((prov) => (
                  <option key={prov._id} value={prov._id}>
                    {prov.label[i18n.language]}
                  </option>
                ))}
              </select>

              {formData.province && (
                <select
                  id="city"
                  name="city"
                  className="add-driver-form-input add-driver-address-select"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    {t("city")}
                  </option>
                  {provinces
                    .find((prov) => prov._id === formData.province)
                    ?.cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.label[i18n.language]}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>

          <div className="add-driver-form-group">
            <label htmlFor="description">{t("description")}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("driver_description_placeholder")}
              className="add-driver-form-input add-driver-form-textarea"
            />
          </div>

          <button type="submit" className="add-driver-form-btn">
            {t("add")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
