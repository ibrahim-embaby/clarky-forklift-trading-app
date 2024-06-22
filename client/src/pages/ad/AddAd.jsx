import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createAd } from "../../redux/apiCalls/adApiCall";
import { useDropzone } from "react-dropzone";
import { fetchControls } from "../../redux/apiCalls/controlsApiCalls";

function AddAd() {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("1");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [saleOrRent, setSaleOrRent] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [fileUrls, setFileUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { provinces, itemTypes, statuses, adTargets } = useSelector(
    (state) => state.controls
  );

  useEffect(() => {
    dispatch(fetchControls());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!category) errors.category = t("required");
    if (!price || price <= 0) errors.price = t("required");
    if (!title || title.length < 3 || title.length > 200)
      errors.title = t("title_validation");
    if (!desc || desc.length < 3 || desc.length > 5000)
      errors.desc = t("desc_validation");
    if (!phone || !/^(010|011|012|015)\d{8}$/.test(phone))
      errors.phone = t("phone_validation");
    if (!province) errors.province = t("required");
    if (!city) errors.city = t("required");
    if (!status) errors.status = t("required");
    if (!saleOrRent) errors.saleOrRent = t("required");
    if (files.length < 1 || files.length > 10)
      errors.photos = t("photos_validation");

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const ad = {
      title,
      description: desc,
      price,
      province,
      city,
      photos: files,
      saleOrRent,
      status,
      quantity,
      phone,
      itemType: category,
    };

    dispatch(createAd(ad));
    setCategory("");
    setPrice("1");
    setTitle("");
    setDesc("");
    setPhone("");
    setProvince("");
    setCity("");
    setStatus("");
    setSaleOrRent("");
    setQuantity("1");
    setFileUrls([]);
    setFiles([]);
    setErrors({});
    setFileError("");
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = [];
      const invalidFiles = [];

      acceptedFiles.forEach((file) => {
        if (file.size <= 2 * 1024 * 1024) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        setFileError(t("file_size_error"));
      } else {
        setFileError("");
      }

      const readFiles = validFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ url: reader.result, file });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readFiles)
        .then((fileData) => {
          const urls = fileData.map((data) => data.url);
          const fileObjs = fileData.map((data) => data.file);
          setFileUrls((prevUrls) => [...prevUrls, ...urls]);
          setFiles((prevFiles) => [...prevFiles, ...fileObjs]);
        })
        .catch((error) => console.error("Error reading files: ", error));
    },
    [t]
  );

  const handleRemoveImage = (index) => {
    setFileUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
    noClick: true,
  });

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setCity("");
  };

  return (
    <div className="add-ad">
      <div className="container">
        <div
          className="add-ad-wrapper"
          style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
        >
          <form className="add-ad-form" onSubmit={handleSubmitAdForm}>
            <div className="add-ad-select-wrapper">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-ad-category"
                required
              >
                <option value="" disabled>
                  {t("item_type_select")}
                </option>

                {itemTypes.map((itemType) => (
                  <option key={itemType._id} value={itemType._id}>
                    {itemType.label[i18n.language]}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error">{errors.category}</span>
              )}

              <select
                className="select-ad-sell-type"
                value={saleOrRent}
                onChange={(e) => setSaleOrRent(e.target.value)}
                required
              >
                <option value="" disabled>
                  {t("purpose")}
                </option>
                {adTargets.map((adTarget) => (
                  <option key={adTarget._id} value={adTarget._id}>
                    {adTarget.label[i18n.language]}
                  </option>
                ))}
              </select>
              {errors.saleOrRent && (
                <span className="error">{errors.saleOrRent}</span>
              )}

              <select
                className="select-ad-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="" disabled>
                  {t("condition")}
                </option>
                {statuses.map((status) => (
                  <option key={status._id} value={status._id}>
                    {status.label[i18n.language]}
                  </option>
                ))}
              </select>
              {errors.status && <span className="error">{errors.status}</span>}

              <div className="quantity-wrapper">
                <label htmlFor="quantity"> {t("quantity")}:</label>
                <input
                  type="number"
                  min={1}
                  className="quantity-input"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>

            <div className="add-ad-title">
              <label className="add-ad-label">{t("ad_title")} </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="add-ad-input"
                required
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>

            <div className="add-ad-price">
              <label className="add-ad-label">{t("price")}</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onWheel={(e) => e.target.blur()}
                type="number"
                className="add-ad-input"
                required
                min={1}
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>

            <div className="add-ad-desc">
              <label className="add-ad-label">{t("description")}</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="add-ad-input"
                cols="30"
                rows="6"
                required
              ></textarea>
              {errors.desc && <span className="error">{errors.desc}</span>}
            </div>

            <div className="add-ad-mobile">
              <label className="add-ad-label">{t("phone")} </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className="add-ad-input"
                required
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="add-ad-address">
              <label className="add-ad-label">{t("address")}</label>

              <div className="add-ad-select-wrapper">
                <select
                  className="select-ad-province"
                  value={province}
                  onChange={handleProvinceChange}
                  required
                >
                  <option value="" disabled>
                    {t("province")}
                  </option>
                  {provinces.map((prov) => (
                    <option key={prov._id} value={prov._id}>
                      {i18n.language === "ar" ? prov.label.ar : prov.label.en}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <span className="error">{errors.province}</span>
                )}

                <select
                  className="select-ad-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    {t("city")}
                  </option>
                  {provinces
                    .find((prov) => prov._id === province)
                    ?.cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {i18n.language === "ar" ? city.label.ar : city.label.en}
                      </option>
                    ))}
                </select>
                {errors.city && <span className="error">{errors.city}</span>}
              </div>
            </div>

            <div className="add-ad-photos">
              <label className="add-ad-photo">{t("photos")}</label>
              <div className="add-ad-photos-display">
                {fileUrls.map((url, index) => (
                  <div key={index} className="preview-image-container">
                    <img
                      src={url}
                      alt={`File preview ${index}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div className="add-image-container" onClick={open}>
                  <div className="add-image-plus">+</div>
                </div>
              </div>
              {errors.photos && <span className="error">{errors.photos}</span>}
              {fileError && <span className="error">{fileError}</span>}
              <div {...getRootProps({ className: "dropzone hidden-dropzone" })}>
                <input {...getInputProps()} />
              </div>
            </div>

            <button type="submit" className="add-ad-form-btn">
              {t("submit_ad_for_review")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAd;
