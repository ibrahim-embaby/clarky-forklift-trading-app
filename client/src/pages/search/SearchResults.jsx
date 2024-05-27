import { useEffect, useState } from "react";
import "./search.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchSidebar from "./SearchSidebar";
import { fetchAllAds } from "../../redux/apiCalls/adApiCall";
import SearchItem from "./SearchItem";
import { Loading } from "../../components/loading/Loading";
import { fetchControls } from "../../redux/apiCalls/controlsApiCalls";
import { Pagination } from "@mui/material";

function SearchResults() {
  const { ads, searchResultsCount, adLoading } = useSelector(
    (state) => state.ad
  );

  const { provinces, itemTypes, statuses } = useSelector(
    (state) => state.controls
  );

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dispatch = useDispatch();
  const [province, setProvince] = useState(
    location.state?.province || { value: "", _id: "" }
  );
  const [status, setStatus] = useState(
    location.state?.status || { value: "", _id: "" }
  );
  const [itemType, setItemType] = useState(
    location.state?.itemType || { value: "", _id: "" }
  );
  const [searchInput, setSearchInput] = useState(location.state?.search || "");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();
  document.title = t("search_page_title");

  const RESULTS_PER_PAGE = 10;
  const pages = Math.ceil((searchResultsCount ?? 0) / RESULTS_PER_PAGE);

  const resetFormHandler = (e) => {
    e.preventDefault();
    setProvince({ value: "", _id: "" });
    setStatus({ value: "", _id: "" });
    setItemType({ value: "", _id: "" });
    setSearchInput("");
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchControls());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    dispatch(
      fetchAllAds(
        "published",
        province?._id,
        status?._id,
        itemType?._id,
        searchInput,
        page || null
      )
    );
  }, [dispatch, status, itemType, province, searchInput, page]);

  useEffect(() => {
    setSearchParams(
      {
        province: province.value,
        status: status.value,
        itemType: itemType.value,
        search: searchInput,
        page: page,
      },
      { relative: "route", replace: true }
    );
  }, [searchParams, status, itemType, province, searchInput, page]);

  return (
    <div
      className="search-results"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="container">
        <div className="search-results-wrapper">
          <SearchSidebar
            params={params}
            province={province}
            provinces={provinces}
            setProvince={setProvince}
            itemTypes={itemTypes}
            itemType={itemType}
            setItemType={setItemType}
            statuses={statuses}
            status={status}
            setStatus={setStatus}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setPage={setPage}
            t={t}
            lang={i18n.language}
            resetFormHandler={resetFormHandler}
          />

          <div className="search-results-main">
            {adLoading ? (
              <Loading
                style={{
                  height: "0",
                  minHeight: "0",
                }}
              />
            ) : ads.length >= 1 ? (
              <>
                <p className="search-results-count">
                  {t("search_results")} {searchResultsCount}
                </p>
                <div className="search-results-main-items">
                  {ads.map((ad) => (
                    <SearchItem key={ad._id} item={ad} />
                  ))}
                </div>
              </>
            ) : (
              <p className="no-results-found">{t("no_results")}</p>
            )}
            {!adLoading && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
