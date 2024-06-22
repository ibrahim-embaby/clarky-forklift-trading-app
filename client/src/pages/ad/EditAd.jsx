import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { fetchControls } from "../../redux/apiCalls/controlsApiCalls";
import { Loading } from "../../components/loading/Loading";
import { getAd, updateAd } from "../../redux/apiCalls/adApiCall";

function EditAd() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { provinces, itemTypes, statuses, adTargets } = useSelector(
    (state) => state.controls
  );
  const { currentAd: ad, adLoading } = useSelector((state) => state.ad);

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(1);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [saleOrRent, setSaleOrRent] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [existingFileUrls, setExistingFileUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchControls());
    if (id) {
      dispatch(getAd(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (ad) {
      setCategory(ad.itemType._id);
      setPrice(ad.price);
      setTitle(ad.title);
      setDesc(ad.description);
      setPhone(ad.phone);
      setProvince(ad.province._id);
      setCity(ad.city._id);
      setStatus(ad.status._id);
      setSaleOrRent(ad.saleOrRent);
      setQuantity(ad.quantity);
      setExistingFileUrls(ad.photos);
    }
  }, [ad]);

  const getChangedProperties = (original, updated) => {
    const changed = {};
    Object.keys(updated).forEach((key) => {
      if (original[key] !== updated[key]) {
        changed[key] = updated[key];
      }
    });
    return changed;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!category) newErrors.category = t("required");
    if (!price || price <= 0) newErrors.price = t("required");
    if (!title || title.length < 3 || title.length > 200)
      newErrors.title = t("title_validation");
    if (!desc || desc.length < 3 || desc.length > 5000)
      newErrors.desc = t("desc_validation");
    if (!phone || !/^(010|011|012|015)\d{8}$/.test(phone))
      newErrors.phone = t("phone_validation");
    if (!province) newErrors.province = t("required");
    if (!city) newErrors.city = t("required");
    if (
      !existingFileUrls.length + newFiles.length ||
      existingFileUrls.length + newFiles.length > 10
    )
      newErrors.photos = t("photos_validation");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAdForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedAd = {
      title,
      description: desc,
      price,
      phone,
      itemType: category,
      province,
      city,
      saleOrRent,
      status,
      quantity,
      existingFileUrls,
      newFiles,
    };

    const changedProperties = getChangedProperties(ad, updatedAd);
    if (newFiles.length > 0) {
      changedProperties.newFiles = newFiles.map((file) => file.file);
    }
    if (existingFileUrls.length !== ad.photos.length) {
      changedProperties.existingFileUrls = existingFileUrls;
    }

    dispatch(updateAd(id, changedProperties));
    navigate(`/ads/${id}`);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const validFiles = [];
      const fileErrors = {};

      acceptedFiles.forEach((file, index) => {
        if (file.size > maxSize) {
          fileErrors[`file_${index}`] = t("file_size_error");
        } else {
          validFiles.push({
            url: URL.createObjectURL(file),
            file,
          });
        }
      });

      setErrors((prevErrors) => ({ ...prevErrors, ...fileErrors }));
      setNewFiles((prevFiles) => [...prevFiles, ...validFiles]);
    },
    [t]
  );

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setExistingFileUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    } else {
      setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
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

  const handleCancelEdit = () => {
    navigate(-1);
  };

  return (
    <div className="edit-ad">
      <div className="container">
        {adLoading ? (
          <Loading />
        ) : (
          <div
            className="edit-ad-wrapper"
            style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
          >
            <h1 className="edit-ad-page-title">{t("edit_ad")}</h1>
            <form className="edit-ad-form" onSubmit={handleSubmitAdForm}>
              <div className="edit-ad-select-wrapper">
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
                {errors.status && (
                  <span className="error">{errors.status}</span>
                )}

                <div className="quantity-wrapper">
                  <label htmlFor="quantity">{t("quantity")}:</label>
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
              {errors.quantity && (
                <span className="error">{errors.quantity}</span>
              )}

              <div className="edit-ad-title">
                <label className="edit-ad-label">{t("ad_title")}</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  className="edit-ad-input"
                  required
                />
              </div>
              {errors.title && <span className="error">{errors.title}</span>}

              <div className="edit-ad-price">
                <label className="edit-ad-label">{t("price")}</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  className="edit-ad-input"
                  required
                  min={1}
                />
              </div>
              {errors.price && <span className="error">{errors.price}</span>}

              <div className="edit-ad-desc">
                <label className="edit-ad-label">{t("description")}</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="edit-ad-input"
                  cols="30"
                  rows="6"
                  required
                ></textarea>
              </div>
              {errors.desc && <span className="error">{errors.desc}</span>}

              <div className="edit-ad-mobile">
                <label className="edit-ad-label">{t("phone")}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  className="edit-ad-input"
                  required
                />
              </div>
              {errors.phone && <span className="error">{errors.phone}</span>}

              <div className="edit-ad-address">
                <label className="edit-ad-label">{t("address")}</label>
                <div className="edit-ad-select-wrapper">
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
                          {i18n.language === "ar"
                            ? city.label.ar
                            : city.label.en}
                        </option>
                      ))}
                  </select>
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>
              </div>

              <div className="edit-ad-photos">
                <label className="edit-ad-label">{t("photos")}</label>
                <div className="edit-ad-photos-display">
                  {existingFileUrls.map((url, index) => (
                    <div key={index} className="preview-image-container">
                      <img
                        src={url}
                        alt={`File preview ${index}`}
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {newFiles.map((file, index) => (
                    <div key={index} className="preview-image-container">
                      <img
                        src={file.url}
                        alt={`File preview ${index}`}
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <div className="add-image-container" onClick={open}>
                    <div className="add-image-plus">+</div>
                  </div>
                </div>
                <div
                  {...getRootProps({ className: "dropzone hidden-dropzone" })}
                >
                  <input {...getInputProps()} />
                </div>
                {errors.photos && (
                  <span className="error">{errors.photos}</span>
                )}
                {Object.keys(errors)
                  .filter((key) => key.startsWith("file_"))
                  .map((key) => (
                    <span key={key} className="error">
                      {errors[key]}
                    </span>
                  ))}
              </div>

              <div className="edit-ad-btns">
                <button type="submit" className="edit-ad-form-btn">
                  {t("edit")}
                </button>
                <button
                  type="button"
                  className="edit-ad-form-cancel-btn"
                  onClick={handleCancelEdit}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAd;
