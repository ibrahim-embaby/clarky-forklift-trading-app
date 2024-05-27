import { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch, useSelector } from "react-redux";
import { fetchControls } from "../../redux/apiCalls/controlsApiCalls";
import { Loading } from "../../components/loading/Loading";
import SearchIcon from "@mui/icons-material/Search";

function Home() {
  const navigate = useNavigate();
  const [itemType, setItemType] = useState(null);
  const [status, setStatus] = useState(null);
  const [province, setProvince] = useState(null);
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
        <div className="home">
          <section className="home-top">
            <div className="home-top-wrapper">
              <h1 className="home-top-title">{t("home_top_section_title")}</h1>
              <form
                className="search-bar"
                onSubmit={searchFormHandler}
                style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
              >
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
                <div className="search-bar-inputs-wrapper">
                  <div
                    className="search-bar-select-wrapper"
                    style={{
                      backgroundColor: itemType && "#ffd7d7",
                    }}
                  >
                    <select
                      className="search-bar-item"
                      value={itemType ? JSON.stringify(itemType) : ""}
                      onChange={(e) => setItemType(JSON.parse(e.target.value))}
                      style={{
                        backgroundColor: itemType && "#ffd7d7",
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
                    {itemType && (
                      <HighlightOffIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => setItemType("")}
                      />
                    )}
                  </div>

                  <div
                    className="search-bar-select-wrapper"
                    style={{
                      backgroundColor: status && "#ffd7d7",
                    }}
                  >
                    <select
                      className="search-bar-item"
                      value={status ? JSON.stringify(status) : ""}
                      onChange={(e) => setStatus(JSON.parse(e.target.value))}
                      style={{
                        backgroundColor: status && "#ffd7d7",
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
                    {status && (
                      <HighlightOffIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => setStatus("")}
                      />
                    )}
                  </div>

                  <div
                    className="search-bar-select-wrapper"
                    style={{
                      backgroundColor: province && "#ffd7d7",
                    }}
                  >
                    <select
                      className="search-bar-item"
                      value={province ? JSON.stringify(province) : ""}
                      onChange={(e) => setProvince(JSON.parse(e.target.value))}
                      style={{
                        backgroundColor: province && "#ffd7d7",
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
                    {province && (
                      <HighlightOffIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => setProvince("")}
                      />
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
