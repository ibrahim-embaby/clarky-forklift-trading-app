import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTable, usePagination } from "react-table";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  adminAcceptRejectDriver,
  adminFetchDrivers,
} from "../../redux/apiCalls/adminApiCalls";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteDriver } from "../../redux/apiCalls/driverApiCalls";

const MySwal = withReactContent(Swal);

const filters = [
  {
    id: "1",
    value: true,
    label: {
      ar: "تمت الموافقة",
      en: "accepted",
    },
  },
  {
    id: "2",
    value: false,
    label: {
      ar: "مرفوض",
      en: "rejected",
    },
  },
];

function Drivers() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { drivers, driversCount } = useSelector((state) => state.admin);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rejectionReason, setRejectionReason] = useState({});
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({
    id: "",
    value: "",
    label: {
      ar: "",
      en: "",
    },
  });
  const rejectionInputRef = useRef(null);

  useEffect(() => {
    const acceptedFilter = filters.find((filter) => filter.id === "1");
    setCurrentFilter(acceptedFilter);
  }, []);

  useEffect(() => {
    if (currentFilter.id) {
      dispatch(
        adminFetchDrivers({
          isAccepted: currentFilter.value,
          page: pageIndex,
          pageSize,
        })
      );
    }
  }, [pageIndex, pageSize, currentFilter]);

  const handleFilter = (filter) => {
    setPageIndex(0);
    setPageSize(10);
    setCurrentFilter(filter);
  };

  const rejectAdHandler = (id) => {
    const reason = rejectionReason[id] || "";
    if (!reason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    dispatch(adminAcceptRejectDriver(id, false, reason));

    setSelectedDriverId(null);
    setRejectionReason((prev) => ({ ...prev, [id]: "" }));
  };

  const acceptDriverHandler = (id) => {
    dispatch(adminAcceptRejectDriver(id, true));
  };

  const handleRejectClick = (id) => {
    selectedDriverId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (selectedDriverId !== null) {
      rejectionInputRef.current?.focus();
    }
  }, [selectedDriverId]);

  const deleteDriverHandler = (id) => {
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

  const columns = useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
      },
      {
        Header: "الصورة",
        accessor: "photo",
        Cell: ({ row }) => (
          <img src={row.original.photo.url} alt="" width={100} />
        ),
      },
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
            {selectedDriverId === row.original._id && (
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
                <button onClick={() => rejectAdHandler(row.original._id)}>
                  Submit Rejection
                </button>
              </div>
            )}
            <span
              onClick={() => acceptDriverHandler(row.original._id)}
              className="admin-accept-ad-btn"
            >
              موافقة
            </span>
            <span
              onClick={() => deleteDriverHandler(row.original._id)}
              className="admin-delete-ad-btn"
            >
              حذف
            </span>
          </div>
        ),
      },
    ],
    [selectedDriverId, rejectionReason]
  );

  const pageCount = Math.ceil(driversCount / pageSize);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data: drivers,
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
        {filters.map((filter) => (
          <span
            key={filter.id}
            onClick={() => handleFilter(filter)}
            style={{
              backgroundColor:
                currentFilter.id === filter.id ? "#ffd7d7" : "#ddd",
            }}
            className="filter-item"
          >
            {filter.label[i18n.language]}
          </span>
        ))}
      </div>
      {driversCount > 0 ? (
        <>
          <p className="admin-ads-count">عدد السائقين: {driversCount}</p>
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
        <p>لا يوجد سائقين</p>
      )}
    </div>
  );
}

export default Drivers;
