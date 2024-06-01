import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import Navbar from "./Navbar";
import "./header.css";

function Header() {
  const [toggle, setToggle] = useState(false);
  const location = useLocation();
  const headerClass = location.pathname.startsWith("/message")
    ? "header"
    : "fixed-header";

  return (
    <header className={headerClass}>
      <div className="header-container">
        <HeaderLeft />
        <Navbar toggle={toggle} setToggle={setToggle} />
        <HeaderRight toggle={toggle} setToggle={setToggle} />
      </div>
    </header>
  );
}

export default Header;
