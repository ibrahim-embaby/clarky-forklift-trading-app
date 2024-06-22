import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTable, usePagination } from "react-table";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { deleteAd } from "../../redux/apiCalls/adApiCall";
import {
  adminAcceptRefuseAd,
  adminFetchAds,
} from "../../redux/apiCalls/adminApiCalls";
import { createNotification } from "../../redux/apiCalls/notificationApiCalls";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { fetchAdStatuses } from "../../redux/apiCalls/controlsApiCalls";

const MySwal = withReactContent(Swal);

function Ads({ socket }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { ads, adsCount } = useSelector((state) => state.admin);
  const { adStatuses } = useSelector((state) => state.controls);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rejectionReason, setRejectionReason] = useState({});
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ _id: "", value: "" });
  const rejectionInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdStatuses());
  }, []);

  useEffect(() => {
    if (adStatuses.length > 0) {
      const publishedStatus = adStatuses.find(
        (adStatus) => adStatus.value === "published"
      );
      if (publishedStatus) {
        setCurrentFilter(publishedStatus);
      }
    }
  }, [adStatuses]);

  useEffect(() => {
    if (currentFilter._id) {
      dispatch(
        adminFetchAds({
          adStatus: currentFilter._id,
          page: pageIndex,
          pageSize,
        })
      );
    }
  }, [pageIndex, pageSize, currentFilter._id]);

  const handleFilter = (adStatus) => {
    setPageIndex(0);
    setPageSize(10);
    setCurrentFilter(adStatus);
  };

  const rejectAdHandler = (adId, userId, adTitle) => {
    const reason = rejectionReason[adId] || "";
    if (!reason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    dispatch(adminAcceptRefuseAd(adId, "rejected", reason));
    dispatch(
      createNotification({
        receiverId: userId,
        adId,
        type: "adRejected",
      })
    );
    socket?.current.emit("sendNotificationAlert", {
      receiverId: userId,
    });
    setSelectedAdId(null);
    setRejectionReason((prev) => ({ ...prev, [adId]: "" }));
  };

  const acceptAdHandler = (adId, userId, adTitle) => {
    dispatch(adminAcceptRefuseAd(adId, "published"));
    dispatch(
      createNotification({
        receiverId: userId,
        adId,
        type: "adAccepted",
      })
    );
    socket?.current.emit("sendNotificationAlert", {
      receiverId: userId,
    });
  };

  const handleRejectClick = (adId) => {
    setSelectedAdId((prev) => (prev === adId ? null : adId));
  };

  useEffect(() => {
    if (selectedAdId !== null) {
      rejectionInputRef.current?.focus();
    }
  }, [selectedAdId]);

  const deleteAdHandler = (adId) => {
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
        dispatch(deleteAd(adId));
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "العنوان",
        accessor: "title",
        Cell: ({ value, row }) => (
          <Link to={`/ads/${row.original._id}`}>{value}</Link>
        ),
      },
      { Header: "اسم المعلن", accessor: "userId.username" },
      { Header: "الوصف", accessor: "description" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="admin-ads-actions">
            <span
              onClick={() => handleRejectClick(row.original._id)}
              className="admin-delete-ad-btn"
            >
              رفض
            </span>
            {selectedAdId === row.original._id && (
              <div>
                <textarea
                  ref={rejectionInputRef}
                  value={rejectionReason[row.original._id] || ""}
                  onChange={(e) =>
                    setRejectionReason((prev) => ({
                      ...prev,
                      [row.original._id]: e.target.value,
                    }))
                  }
                  placeholder="Enter rejection reason"
                />
                <button
                  onClick={() =>
                    rejectAdHandler(
                      row.original._id,
                      row.original.userId._id,
                      row.original.title
                    )
                  }
                >
                  Submit Rejection
                </button>
              </div>
            )}
            <span
              onClick={() =>
                acceptAdHandler(
                  row.original._id,
                  row.original.userId._id,
                  row.original.title
                )
              }
              className="admin-accept-ad-btn"
            >
              موافقة
            </span>
            <span
              onClick={() => deleteAdHandler(row.original._id)}
              className="admin-delete-ad-btn"
            >
              حذف
            </span>
          </div>
        ),
      },
    ],
    [selectedAdId, rejectionReason]
  );

  const pageCount = Math.ceil(adsCount / pageSize);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data: ads,
        initialState: { pageIndex, pageSize },
        manualPagination: true,
        pageCount,
      },
      usePagination
    );

  const handleNextPage = () => {
    if (pageIndex < pageCount - 1) {
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prevPageIndex) => prevPageIndex - 1);
    }
  };

  const handleGotoPage = (index) => {
    const page = Math.max(0, Math.min(index, pageCount - 1));
    setPageIndex(page);
  };

  const handleSetPageSize = (size) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  return (
    <div className="admin-ads">
      <div className="admin-ads-filter">
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
      {adsCount > 0 ? (
        <>
          <p className="admin-ads-count">عدد الإعلانات: {adsCount}</p>
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handleGotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </button>
            <button
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </button>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={!canNextPage}
            >
              {">"}
            </button>
            <button
              className="pagination-btn"
              onClick={() => handleGotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
            <span>
              صفحة{" "}
              <strong>
                {pageIndex + 1} من {pageCount}
              </strong>{" "}
            </span>
            <span>
              | ذهاب إلي:{" "}
              <input
                type="number"
                className="pagination-input"
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  handleGotoPage(page);
                }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                handleSetPageSize(Number(e.target.value));
              }}
              className="pagination-select"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  عرض {size}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <p>لا توجد اعلانات</p>
      )}
    </div>
  );
}

export default Ads;
