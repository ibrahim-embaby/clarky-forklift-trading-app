import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../redux/apiCalls/profileApiCall";
import { fetchAllUsers } from "../../redux/apiCalls/adminApiCalls";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Users() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { users, usersCount } = useSelector((state) => state.admin);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchAllUsers({ page: pageIndex, pageSize }));
  }, [pageIndex, pageSize, dispatch]);

  const columns = useMemo(
    () => [
      { Header: "الاسم", accessor: "username" },
      { Header: "البريد الإلكتروني", accessor: "email" },
      { Header: "الدور", accessor: "role" },
      { Header: "رقم الهاتف", accessor: "mobile" },
      {
        Header: "الخيارات",
        accessor: "actions",
        Cell: ({ row }) => {
          return (
            row.original.role !== "admin" && (
              <button onClick={() => deleteUserHandler(row.original._id)}>
                Delete
              </button>
            )
          );
        },
      },
    ],
    []
  );

  const pageCount = Math.ceil(usersCount / pageSize);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data: users,
        initialState: { pageIndex, pageSize },
        manualPagination: true,
        pageCount,
      },
      usePagination
    );

  const deleteUserHandler = (id) => {
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
        dispatch(deleteUser(id));
      }
    });
  };

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

  return users.length ? (
    <div className="users-panel">
      <p>عدد المستخدمين: {usersCount}</p>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
    </div>
  ) : (
    <p>لا توجد نتائج</p>
  );
}

export default Users;
