function Statistics({ usersNumber, adsCount }) {
  return (
    <div className=" statistics">
      <div className="statistics-item">
        <h4 className="number-title">عدد المستخدمين</h4>
        <p>{usersNumber}</p>
      </div>
      <div className="statistics-item">
        <h4 className="number-title">عدد الإعلانات المنشورة</h4>
        <p>{adsCount}</p>
      </div>
    </div>
  );
}

export default Statistics;
