import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";

const EditDriverModal = ({ isOpen, onClose, driver, onUpdate, provinces }) => {
  const { i18n, t } = useTranslation();
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    age: "",
    experienceYears: "",
    mobile: "",
    province: "",
    city: "",
    photo: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    experienceYears: "",
    mobile: "",
    province: "",
    city: "",
    photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [initialProvince, setInitialProvince] = useState("");

  useEffect(() => {
    if (driver) {
      const initialData = {
        name: driver.name,
        age: driver.age,
        experienceYears: driver.experienceYears,
        mobile: driver.mobile,
        province: driver.province._id,
        city: driver.city._id,
        photo: driver.photo?.url || "",
      };
      setInitialFormData(initialData);
      setFormData(initialData);
      setPhotoPreview(driver.photo?.url || "");
      setInitialProvince(driver.province._id);
    }
  }, [driver]);

  useEffect(() => {
    if (formData.province !== initialProvince) {
      setFormData((prevFormData) => ({ ...prevFormData, city: "" }));
    }
  }, [formData.province, initialProvince]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== initialFormData[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});
    onUpdate(updatedFields);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      style={{
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
    >
      <DialogTitle className="edit-driver-title">
        {t("edit_driver")}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="edit-driver-form">
          <div className="edit-driver-photo-upload">
            <Avatar
              src={photoPreview}
              alt={t("driver_photo")}
              className="edit-driver-avatar"
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoChange}
            />
            <label htmlFor="photo-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>
          <TextField
            label={t("name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t("age")}
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t("experience_years")}
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t("phone")}
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>{t("province")}</InputLabel>
            <Select
              name="province"
              value={formData.province}
              onChange={handleChange}
            >
              {provinces.map((province) => (
                <MenuItem key={province._id} value={province._id}>
                  {province.label[i18n.language]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>{t("city")}</InputLabel>
            <Select
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.province}
            >
              <MenuItem value="" disabled>
                {t("select_city")}
              </MenuItem>
              {formData.province &&
                provinces
                  .find((province) => province._id === formData.province)
                  ?.cities.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.label[i18n.language]}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" className="edit-driver-btn">
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          className="edit-driver-btn"
        >
          {t("edit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDriverModal;
