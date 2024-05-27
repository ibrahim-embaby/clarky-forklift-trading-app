import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";

function SearchSidebar({
  params,
  province,
  provinces,
  setProvince,
  setPage,
  itemTypes,
  itemType,
  setItemType,
  statuses,
  status,
  setStatus,
  t,
  searchInput,
  setSearchInput,
  resetFormHandler,
  lang,
}) {
  return (
    <div className="search-results-sidebar">
      <div className="search-results-sidebar-wrapper">
        <form className="search-results-form">
          <div className="sidebar-input-wrapper">
            <SearchIcon
              sx={{
                color: "var(--primary-color)",
              }}
            />
            <input
              type="text"
              className="sidebar-input"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder={t("search_placeholder")}
            />
          </div>
          <div className="select-wrapper">
            <select
              value={itemType?._id ? JSON.stringify(itemType) : ""}
              onChange={(e) => {
                setItemType(JSON.parse(e.target.value));
                setPage(1);
                params.set("itemType", JSON.parse(e.target.value).value);
              }}
              className="siderbar-select"
            >
              <option value={""} disabled>
                {t("item_type_select")}
              </option>
              {itemTypes.map((itemType) => (
                <option
                  key={itemType.value}
                  value={JSON.stringify({
                    value: itemType.value,
                    _id: itemType._id,
                  })}
                >
                  {itemType.label[lang]}
                </option>
              ))}
            </select>
            {itemType?._id && (
              <HighlightOffIcon
                sx={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => setItemType({ value: "", _id: "" })}
              />
            )}
          </div>

          <div className="select-wrapper">
            <select
              value={status?._id ? JSON.stringify(status) : ""}
              onChange={(e) => {
                setStatus(JSON.parse(e.target.value));
                setPage(1);
                params.set("status", JSON.parse(e.target.value).value);
              }}
              className="siderbar-select"
            >
              <option value={""} disabled>
                {t("condition")}
              </option>
              {statuses.map((status) => (
                <option
                  key={status.value}
                  value={JSON.stringify({
                    value: status.value,
                    _id: status._id,
                  })}
                >
                  {status.label[lang]}
                </option>
              ))}
            </select>
            {status?._id && (
              <HighlightOffIcon
                sx={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => setStatus({ value: "", _id: "" })}
              />
            )}
          </div>

          <div className="select-wrapper">
            <select
              value={province?._id ? JSON.stringify(province) : ""}
              onChange={(e) => {
                setProvince(JSON.parse(e.target.value));
                setPage(1);
                params.set("province", JSON.parse(e.target.value).value);
              }}
              className="siderbar-select"
            >
              <option value={""} disabled>
                {t("province")}
              </option>
              {provinces.map((province) => (
                <option
                  key={province.value}
                  value={JSON.stringify({
                    value: province.value,
                    _id: province._id,
                  })}
                >
                  {province.label[lang]}
                </option>
              ))}
            </select>
            {province?._id && (
              <HighlightOffIcon
                sx={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => setProvince({ value: "", _id: "" })}
              />
            )}
          </div>

          <button
            className="search-results-form-btn"
            onClick={resetFormHandler}
          >
            {t("reset_inputs")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchSidebar;
