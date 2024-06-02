import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAds } from "../../redux/apiCalls/profileApiCall";
import { useParams } from "react-router-dom";
import "./profile.css";
import { useTranslation } from "react-i18next";
import SearchItem from "../search/SearchItem";
import { Loading } from "../../components/loading/Loading";
import { Pagination } from "@mui/material";
import { fetchAdStatuses } from "../../redux/apiCalls/controlsApiCalls";

function Profile() {
  const dispatch = useDispatch();
  const { userAds, userAdsCount, loading } = useSelector(
    (state) => state.profile
  );
  const { adStatuses } = useSelector((state) => state.controls);

  const [currentFilter, setCurrentFilter] = useState({ _id: "", value: "" });
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  document.title = t("user_profile_page_title");

  const RESULTS_PER_PAGE = 12;
  const pages = Math.ceil((userAdsCount ?? 0) / RESULTS_PER_PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    dispatch(fetchAdStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (adStatuses.length > 0) {
      const publishedStatus = adStatuses.find(
        (adStatus) => adStatus.value === "published"
      );
      if (publishedStatus) {
        setCurrentFilter(publishedStatus);
        dispatch(fetchMyAds(id, publishedStatus._id, 1));
      }
    }
  }, [adStatuses, id]);

  const handleFilter = (adStatus) => {
    setPage(1);
    setCurrentFilter(adStatus);
    dispatch(fetchMyAds(id, adStatus._id, page));
  };

  return (
    <div
      className="profile"
      style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
    >
      <div className="container">
        <div className="profile-wrapper">
          <h2>{t("my_ads")}</h2>

          <div className="profile-filter">
            {adStatuses.map((adStatus) => (
              <span
                key={adStatus._id}
                onClick={() => handleFilter(adStatus)}
                style={{
                  backgroundColor:
                    currentFilter._id === adStatus._id ? "#ffd7d7" : "#ddd",
                }}
                className="filter-item"
              >
                {adStatus.label[i18n.language]}
              </span>
            ))}
          </div>

          {loading ? (
            <Loading />
          ) : userAds.length >= 1 ? (
            <>
              <div className="user-ads">
                {userAds.map((ad) => {
                  if (ad.adStatus === currentFilter._id) {
                    return <SearchItem key={ad._id} item={ad} />;
                  }
                })}
              </div>
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
                  dispatch(fetchMyAds(id, currentFilter._id, value));
                }}
              />
            </>
          ) : (
            <p>{t("no_results")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
