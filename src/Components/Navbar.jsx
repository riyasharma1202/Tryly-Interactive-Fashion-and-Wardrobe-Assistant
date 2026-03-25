import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      {/* Search Bar */}
      <div className="navbar-section searchbar">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
      </div>

      {/* Logo */}
      <Link to="/Home">
        <div className="navbar-section logo">
          <h1 className="brand-name">TRYLY</h1>
        </div>
      </Link>

      {/* Account & Cart */}
      <div className="navbar-section account-cart">
        <Link to="/Login">
          <div className="account">
            <h3 className="acc-h3">Account</h3>
          </div>
        </Link>

        <Link to="/Cart">
          <div className="cart">
            <h3 className="acc-h3">Cart</h3>
          </div>
        </Link>

        {/* ❌ REMOVED MY WARDROBE */}

        <Link to="/recommendations">
          <div className="recommendations">
            <h3 className="acc-h3"> For You</h3>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
