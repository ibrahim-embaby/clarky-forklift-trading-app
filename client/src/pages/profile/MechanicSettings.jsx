import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchMechanic } from "../../redux/apiCalls/mechanicApiCall";
import { useParams } from "react-router-dom";
import TagSelectInput from "../../components/TagSelectInput/TagSelectInput";
import { cars, services } from "../../dummyData";
import Branch from "../forms/Branch";

function WorkshopProfileSettings() {
  const [currentComponent, setCurrentComponent] = useState(1);
  const { t, i18n } = useTranslation();
  document.title = t("admin_page_title");

  const { user } = useSelector((state) => state.auth);
  const { mechanic } = useSelector((state) => state.mechanic);
  console.log(mechanic);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [workshopOwnerUsername, setWorkshopOwnerUsername] = useState(
    user.username
  );
  const [workshopName, setWorkshopName] = useState(user.workshopName);
  const [branches, setBranches] = useState(mechanic.workshopBranches);
  const [selectedServices, setSelectedServices] = useState(
    mechanic.workshopServices
  );
  const [selectedCars, setSelectedCars] = useState(mechanic.cars);
  useEffect(() => {
    dispatch(fetchMechanic(id));
    console.log("object");
  }, []);
  const handleUpdatePassword = (newPassword) => {};
  const handleBranchChange = (index, newBranch) => {
    const newBranches = [...branches];
    newBranches[index] = newBranch;
    // Remove null addresses
    const filteredAddresses = newBranches.filter((branch) => branch !== null);
    // Ensure at least one address input group is always present
    if (filteredAddresses.length === 0) {
      filteredAddresses.push({
        street: "",
        province: "",
        city: "",
        cities: [],
        postalCode: "",
      });
    }
    setBranches(filteredAddresses);
  };

  const handleAddBranch = () => {
    const newBranches = [
      ...branches,
      {
        branchProvince: "",
        branchCity: "",
        cities: [],
        branchAddress: "",
        branchMobile: "",
      },
    ];
    setBranches(newBranches);
  };
  return (
    <div className="mechanic-profile-settings">
      <div
        className="container"
        style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
      >
        <div className="mechanic-profile-settings-wrapper">
          <div className="mechanic-settings-sidebar">
            <div
              onClick={() => setCurrentComponent(1)}
              style={{ backgroundColor: currentComponent === 1 && "#ffd1d1da" }}
              className="admin-sidebar-component"
            >
              <p className="admin-sidebar-text">اعدادت الحساب </p>
            </div>

            <div
              onClick={() => setCurrentComponent(2)}
              style={{ backgroundColor: currentComponent === 2 && "#ffd1d1da" }}
              className="admin-sidebar-component"
            >
              <p className="admin-sidebar-text">اعدادات الملف الشخصي </p>
            </div>
          </div>
          <div className="mechanic-settings-components">
            {currentComponent === 1 ? (
              <div className="mechanic-account-settings">
                <form
                  className="mechanic-account-settings-form"
                  onSubmit={handleUpdatePassword}
                >
                  <input
                    type="text"
                    className="mechanic-account-settings-form-input"
                    disabled
                    value={user.email}
                  />
                  <input
                    type="password"
                    className="mechanic-account-settings-form-input"
                    placeholder="new password"
                  />
                  <button
                    type="submit"
                    className="mechanic-account-settings-form-btn"
                  >
                    update password
                  </button>
                </form>
              </div>
            ) : (
              <div className="mechanic-profile-settings">
                <form className="register-form">
                  <div className="form-group">
                    <h4 className="form-group-title" htmlFor="">
                      {t("register_account_info")}
                    </h4>
                    <div className="form-group-inputs">
                      <div className="form-group-input-wrapper">
                        <label htmlFor="workshopOwnerUsername">
                          {t("register_name")}
                        </label>
                        <input
                          type="text"
                          id="workshopOwnerUsername"
                          value={workshopOwnerUsername}
                          onChange={(e) =>
                            setWorkshopOwnerUsername(e.target.value)
                          }
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="form-group">
                    <h4 className="form-group-title" htmlFor="">
                      {t("register_workshop_info")}
                    </h4>

                    <div className="workshop-info-input-wrapper">
                      <label htmlFor="workshopName">
                        {t("register_workshop_name")}
                      </label>
                      <input
                        type="text"
                        id="workshopName"
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="workshop-info-input-wrapper">
                      <label htmlFor="tag-input">
                        {t("register_workshop_services")}
                      </label>
                      <TagSelectInput
                        selectedOptions={selectedServices}
                        setSelectedOptions={setSelectedServices}
                        options={services}
                        placeholder={t("choose_service")}
                        input_placeholder={t("add_another_service")}
                      />
                    </div>

                    <div className="workshop-info-input-wrapper">
                      <label htmlFor="tag-input">
                        {t("register_workshop_cars")}
                      </label>
                      <TagSelectInput
                        selectedOptions={selectedCars}
                        setSelectedOptions={setSelectedCars}
                        options={cars}
                        placeholder={t("choose_model")}
                        input_placeholder={t("add_another_model")}
                      />
                    </div>

                    <label htmlFor="">{t("register_workshop_branches")}</label>
                    <div className="branches">
                      {branches?.map((branch, index) => (
                        <Branch
                          key={index}
                          index={index}
                          branch={branch}
                          onBranchChange={handleBranchChange}
                          canRemove={branches.length > 1 && branch !== null}
                        />
                      ))}
                      <button
                        className="branch-btn add-branch-btn"
                        type="button"
                        onClick={handleAddBranch}
                      >
                        {t("register_workshop_add_branch")}
                      </button>
                    </div>
                  </div>

                  <button className="register-form-btn" type="submit">
                    {t("register")}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopProfileSettings;
