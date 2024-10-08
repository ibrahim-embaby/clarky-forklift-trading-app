import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatistics } from "../../redux/apiCalls/adminApiCalls";

function Statistics() {
  const dispatch = useDispatch();
  const { statistics } = useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(fetchStatistics());
  }, []);
  return (
    <div className=" statistics">
      <div className="statistics-item">
        <h4 className="number-title">عدد المستخدمين</h4>
        <p>{statistics?.usersCount}</p>
      </div>
      <div className="statistics-item">
        <h4 className="number-title">عدد الإعلانات المنشورة</h4>
        <p>{statistics?.publsihedAdsCount}</p>
      </div>

      <div className="statistics-item">
        <h4 className="number-title">عدد الإعلانات المعلقة</h4>
        <p>{statistics?.pendingAdsCount}</p>
      </div>

      <div className="statistics-item">
        <h4 className="number-title">عدد الإعلانات المرفوضة</h4>
        <p>{statistics?.rejectedAdsCount}</p>
      </div>

      <div className="statistics-item">
        <h4 className="number-title">عدد السائقين</h4>
        <p>{statistics?.driversCount}</p>
      </div>

      <div className="statistics-item">
        <h4 className="number-title">عدد السائقين المعلقين</h4>
        <p>{statistics?.rejectedDriversCount}</p>
      </div>
    </div>
  );
}

export default Statistics;
