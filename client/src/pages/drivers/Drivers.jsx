import React, { useEffect, useState } from "react";
import "./drivers.css";
import DriverCard from "./DriverCard";
import DriverDetailsPanel from "./DriverDetailsPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDriver,
  fetchAllDrivers,
  updateDriver,
} from "../../redux/apiCalls/driverApiCalls";
import { useTranslation } from "react-i18next";
import { fetchProvinces } from "../../redux/apiCalls/controlsApiCalls";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Pagination } from "@mui/material";
import EditDriverModal from "./EditDriverModal";
import { Helmet } from "react-helmet";

const MySwal = withReactContent(Swal);

function Drivers() {
  const { i18n, t } = useTranslation();
  const { drivers, searchResultsCount } = useSelector((state) => state.driver);
  const { provinces } = useSelector((state) => state.controls);
  const dispatch = useDispatch();

  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedCities, setSelectedCities] = useState([]);
  const [experiences, setExperiences] = useState(["all"]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [page, setPage] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchProvinces());
    dispatch(fetchAllDrivers());
  }, []);

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (filterType === "province") {
      setSelectedProvince(value);
      setSelectedCities([]);
    } else if (filterType === "city") {
      setSelectedCities((prev) =>
        isChecked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    } else if (filterType === "experience") {
      if (value === "all") {
        if (isChecked) {
          setExperiences(["all"]);
        }
      } else {
        setExperiences((prev) => {
          let newExperiences;
          if (isChecked) {
            newExperiences = [...prev.filter((item) => item !== "all"), value];
          } else {
            newExperiences = prev.filter((item) => item !== value);
          }
          return newExperiences.length === 0 ? ["all"] : newExperiences;
        });
      }
    }
  };

  const toggleAccordion = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
  };

  useEffect(() => {
    let filteredDrivers = {};

    if (selectedProvince !== "all") {
      filteredDrivers["province"] = selectedProvince;
    }
    if (selectedCities.length > 0) {
      filteredDrivers["cities"] = selectedCities;
    }
    if (!experiences.includes("all")) {
      filteredDrivers["experiences"] = experiences;
    }
    dispatch(
      fetchAllDrivers(
        filteredDrivers.province,
        filteredDrivers.cities,
        filteredDrivers.experiences,
        page
      )
    );
  }, [selectedProvince, selectedCities, experiences, page]);

  const handleSeeMore = (driver) => {
    setSelectedDriver(driver);
  };

  const handleClose = () => {
    setSelectedDriver(null);
  };

  const handleUpdateDriver = (driver) => {
    setDriverToEdit(driver);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = (updatedDriver) => {
    dispatch(updateDriver(driverToEdit._id, updatedDriver));
    setIsUpdateModalOpen(false);
    setDriverToEdit(null);
  };

  const handleDeleteDriver = (id) => {
    MySwal.fire({
      title: t("confirmation_title"),
      text: t("confirmation_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirmation_btn_text"),
      cancelButtonText: t("confirmation_btn_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDriver(id));
      }
    });
  };

  const RESULTS_PER_PAGE = 20;
  const pages = Math.ceil((searchResultsCount ?? 0) / RESULTS_PER_PAGE);

  const [showFilter, setShowFilter] = useState(false);
  const hanldeShowFilters = () => {
    setShowFilter((prev) => !prev);
  };
  return (
    <>
      <Helmet>
        <title>{t("drivers_page_title")}</title>
        <meta name="description" content={t("drivers_page_desc")} />
      </Helmet>

      <div
        className="drivers"
        style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      >
        <div className="container">
          <div
            className="drivers-filters-mobile-icon"
            onClick={hanldeShowFilters}
          >
            {showFilter ? "X" : "Show Filters"}
          </div>
          <div className="drivers-wrapper">
            <aside
              className={`drivers-filters ${showFilter && "show-filters"}`}
            >
              <div className="filter-group">
                <h3
                  className="province-filter-title"
                  onClick={() => toggleAccordion("province")}
                >
                  {t("province")} <KeyboardArrowDownIcon />
                </h3>
                {activeAccordion === "province" && (
                  <div className="checkbox-group">
                    <label key="all-provinces">
                      <input
                        type="radio"
                        value="all"
                        name="province"
                        onChange={(e) => handleFilterChange(e, "province")}
                        checked={selectedProvince === "all"}
                      />
                      {t("all")}
                    </label>
                    {provinces?.map((province) => (
                      <label key={province._id}>
                        <input
                          type="radio"
                          value={province._id}
                          name="province"
                          onChange={(e) => handleFilterChange(e, "province")}
                          checked={selectedProvince === province._id}
                        />
                        {province.label[i18n.language]}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedProvince !== "all" && (
                <div className="filter-group">
                  <h3 onClick={() => toggleAccordion("city")}>
                    {t("city")} <KeyboardArrowDownIcon />
                  </h3>
                  {activeAccordion === "city" && (
                    <div className="checkbox-group">
                      <label key="all-cities">
                        <input
                          type="checkbox"
                          value="all"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCities([]);
                            }
                          }}
                          checked={selectedCities.length === 0}
                        />
                        {t("all")}
                      </label>
                      {provinces
                        .find((p) => p._id === selectedProvince)
                        ?.cities.map((city) => (
                          <label key={city._id}>
                            <input
                              type="checkbox"
                              value={city._id}
                              onChange={(e) => handleFilterChange(e, "city")}
                              checked={selectedCities.includes(city._id)}
                            />
                            {city.label[i18n.language]}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <div className="filter-group">
                <h3 onClick={() => toggleAccordion("experience")}>
                  {t("experience_years")} <KeyboardArrowDownIcon />
                </h3>
                {activeAccordion === "experience" && (
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        value="all"
                        checked={experiences.includes("all")}
                        onChange={(e) => handleFilterChange(e, "experience")}
                      />
                      {t("all")}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="1-3"
                        checked={experiences.includes("1-3")}
                        onChange={(e) => handleFilterChange(e, "experience")}
                      />
                      1 - 3
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="4-7"
                        checked={experiences.includes("4-7")}
                        onChange={(e) => handleFilterChange(e, "experience")}
                      />
                      4 - 7
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="8-10"
                        checked={experiences.includes("8-10")}
                        onChange={(e) => handleFilterChange(e, "experience")}
                      />
                      8 - 10
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="+10"
                        checked={experiences.includes("+10")}
                        onChange={(e) => handleFilterChange(e, "experience")}
                      />
                      +10
                    </label>
                  </div>
                )}
              </div>
            </aside>
            <div
              className={`drivers-results-wrapper ${
                showFilter && "hide-driver-results"
              }`}
            >
              <p className="search-results-count">
                {t("search_results")} {searchResultsCount}
              </p>
              <section className="drivers-results">
                {drivers.map((driver) => (
                  <DriverCard
                    key={driver._id}
                    driver={driver}
                    onSeeMore={handleSeeMore}
                    onUpdate={handleUpdateDriver}
                    onDelete={handleDeleteDriver}
                  />
                ))}
              </section>
              <Pagination
                style={{
                  direction: "ltr",
                  alignSelf: "center",
                  padding: "10px 0px",
                }}
                count={pages}
                variant="outlined"
                shape="rounded"
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                }}
              />
            </div>
          </div>
        </div>
        {selectedDriver && (
          <DriverDetailsPanel driver={selectedDriver} onClose={handleClose} />
        )}
        {isUpdateModalOpen && (
          <EditDriverModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            driver={driverToEdit}
            onUpdate={handleUpdate}
            provinces={provinces}
          />
        )}
      </div>
    </>
  );
}

export default Drivers;
