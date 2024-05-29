import { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchControls } from "../../redux/apiCalls/controlsApiCalls";
import { Loading } from "../../components/loading/Loading";
import SearchIcon from "@mui/icons-material/Search";

function Home() {
  const navigate = useNavigate();
  const [itemType, setItemType] = useState({ value: "", _id: "" });
  const [status, setStatus] = useState({ value: "", _id: "" });
  const [province, setProvince] = useState({ value: "", _id: "" });
  const [searchInput, setSearchInput] = useState("");
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const { provinces, itemTypes, statuses, loading } = useSelector(
    (state) => state.controls
  );
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    dispatch(fetchControls());
  }, []);

  const searchFormHandler = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (province) {
      queryParams.append("province", province?.value);
    }

    if (status) {
      queryParams.append("status", status?.value);
    }

    if (itemType) {
      queryParams.append("itemType", itemType?.value);
    }

    if (searchInput) {
      queryParams.append("search", searchInput);
    }

    navigate(`/search/ads?${queryParams.toString()}`, {
      state: {
        province: { value: province?.value, _id: province?._id },
        status: { value: status?.value, _id: status?._id },
        itemType: { value: itemType?.value, _id: itemType?._id },
        search: searchInput,
      },
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          className="home"
          style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
        >
          <section className="home-top">
            <div className="home-top-wrapper">
              <div className="home-top-title-wrapper">
                <h1 className="home-top-title">
                  <span className="buy">{t("buy")}</span>
                  <span className="rent">{t("rent")}</span>
                  <span className="sell">{t("sell")}</span>
                </h1>
                <h1 className="title-rest">{t("title_rest")}</h1>
              </div>
              <form className="search-bar" onSubmit={searchFormHandler}>
                <div className="search-bar-input-wrapper">
                  <SearchIcon
                    sx={{
                      color: "var(--primary-color)",
                    }}
                  />
                  <input
                    type="text"
                    className="search-bar-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t("search_placeholder")}
                  />
                </div>

                <p className="advanced-search-title">{t("avanced_search")} </p>
                <div className="search-bar-inputs-wrapper">
                  <div
                    className="search-bar-select-wrapper"
                    style={{
                      backgroundColor: itemType?._id && "#ccffcc",
                      borderColor: itemType?._id && "green",
                    }}
                  >
                    <select
                      className="search-bar-item"
                      value={itemType?._id ? JSON.stringify(itemType) : ""}
                      onChange={(e) => setItemType(JSON.parse(e.target.value))}
                      style={{
                        backgroundColor: itemType._id && "#ccffcc",
                      }}
                    >
                      <option
                        value={""}
                        disabled
                        className="search-bar-item-option"
                      >
                        {t("item_type_select")}
                      </option>
                      {Array.from(itemTypes)
                        ?.sort((a, b) =>
                          a.label[i18n.language] > b.label[i18n.language]
                            ? 1
                            : -1
                        )
                        ?.map((itemType) => (
                          <option
                            key={itemType.value}
                            value={JSON.stringify(itemType)}
                            className="search-bar-item-option"
                          >
                            {itemType.label[i18n.language]}
                          </option>
                        ))}
                    </select>
                    {itemType._id && (
                      <p
                        onClick={() => setItemType({ value: "", _id: "" })}
                        className="cancel-btn"
                      >
                        {t("cancel")}
                      </p>
                    )}
                  </div>

                  <div
                    className="search-bar-select-wrapper"
                    style={{
                      backgroundColor: status._id && "#ccffcc",
                      borderColor: status._id && "green",
                    }}
                  >
                    <select
                      className="search-bar-item"
                      value={status._id ? JSON.stringify(status) : ""}
                      onChange={(e) => setStatus(JSON.parse(e.target.value))}
                      style={{
                        backgroundColor: status._id && "#ccffcc",
                      }}
                    >
                      <option
                        value={""}
                        disabled
                        className="search-bar-item-option"
                      >
                        {t("condition")}
                      </option>
                      {Array.from(statuses)
                        ?.sort((a, b) =>
                          a.label[i18n.language] > b.label[i18n.language]
                            ? 1
                            : -1
                        )
                        ?.map((status) => (
                          <option
                            key={status.value}
                            value={JSON.stringify(status)}
                            className="search-bar-item-option"
                          >
                            {status.label[i18n.language]}
                          </option>
                        ))}
                    </select>
                    {status._id && (
                      <p
                        onClick={() => setStatus({ value: "", _id: "" })}
                        className="cancel-btn"
                      >
                        {t("cancel")}
                      </p>
                    )}
                  </div>

                  <div
                    className="search-bar-select-wrapper"
                    style={{
                      backgroundColor: province._id && "#ccffcc",
                      borderColor: province._id && "green",
                    }}
                  >
                    <select
                      className="search-bar-item"
                      value={province._id ? JSON.stringify(province) : ""}
                      onChange={(e) => setProvince(JSON.parse(e.target.value))}
                      style={{
                        backgroundColor: province._id && "#ccffcc",
                      }}
                    >
                      <option
                        value={""}
                        disabled
                        className="search-bar-item-option"
                      >
                        {t("province")}
                      </option>
                      {Array.from(provinces)
                        ?.sort((a, b) =>
                          a.label[i18n.language] > b.label[i18n.language]
                            ? 1
                            : -1
                        )
                        ?.map((province) => (
                          <option
                            key={province.value}
                            value={JSON.stringify(province)}
                            className="search-bar-item-option"
                          >
                            {province.label[i18n.language]}
                          </option>
                        ))}
                    </select>
                    {province._id && (
                      <p
                        onClick={() => setProvince({ value: "", _id: "" })}
                        className="cancel-btn"
                      >
                        {t("cancel")}
                      </p>
                    )}
                  </div>
                </div>
                <button className="search-bar-btn" type="submit">
                  {t("search_btn")}
                </button>
              </form>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Home;
