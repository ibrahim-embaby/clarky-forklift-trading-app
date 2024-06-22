import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import Navbar from "./Navbar";
import "./header.css";
import { useSelector } from "react-redux";

function Header({ socket }) {
  const [toggle, setToggle] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const headerClass = location.pathname.startsWith("/search")
    ? "header"
    : "fixed-header";

  return (
    <header className={headerClass}>
      <div className="header-container">
        <HeaderLeft user={user} />
        <Navbar toggle={toggle} setToggle={setToggle} user={user} />
        <HeaderRight
          socket={socket}
          toggle={toggle}
          setToggle={setToggle}
          user={user}
        />
      </div>
    </header>
  );
}

export default Header;
