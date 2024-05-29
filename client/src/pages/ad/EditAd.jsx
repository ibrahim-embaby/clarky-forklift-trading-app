import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchMyAd } from "../../redux/apiCalls/profileApiCall";
import { useDropzone } from "react-dropzone";
import { fetchControls } from "../../redux/apiCalls/controlsApiCalls";
import { Loading } from "../../components/loading/Loading";

function EditAd() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { provinces, itemTypes, statuses, adTargets } = useSelector(
    (state) => state.controls
  );
  const { ad, loading } = useSelector((state) => state.profile);

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
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

  useEffect(() => {
    dispatch(fetchControls());
    if (id) {
      dispatch(fetchMyAd(id));
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
      setFileUrls(ad.photos);
      setFiles(ad.photos.map((photo) => ({ url: photo, file: null })));
    }
  }, [ad]);

  const handleSubmitAdForm = (e) => {
    e.preventDefault();
    const updatedAd = {
      title,
      description: desc,
      price,
      province,
      city,
      photos: files.filter((file) => file.file).map((file) => file.file),
      saleOrRent,
      status,
      quantity,
      phone,
      itemType: category,
    };
    console.log(updatedAd);

    // dispatch(updateAd(id, updatedAd));
    navigate(`/ads/${id}`);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const readFiles = acceptedFiles.map((file) => {
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
  }, []);

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
    <div className="edit-ad">
      <div className="container">
        {loading ? (
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

                <select
                  className="select-ad-sell-type"
                  value={saleOrRent}
                  onChange={(e) => setSaleOrRent(e.target.value)}
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

                <select
                  className="select-ad-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                <div className="quantity-wrapper">
                  <label htmlFor="quantity">{t("quantity")}:</label>
                  <input
                    type="number"
                    min={1}
                    className="quantity-input"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
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

              <div className="edit-ad-price">
                <label className="edit-ad-label">{t("price")}</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  className="edit-ad-input"
                  required
                />
              </div>

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
                </div>
              </div>

              <div className="edit-ad-photos">
                <label className="edit-ad-label">{t("photos")}</label>
                <div className="edit-ad-photos-display">
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
                <div
                  {...getRootProps({ className: "dropzone hidden-dropzone" })}
                >
                  <input {...getInputProps()} />
                </div>
              </div>

              <button type="submit" className="edit-ad-form-btn">
                {t("submit_ad_for_review")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAd;
