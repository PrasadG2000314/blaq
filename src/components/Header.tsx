"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, toggleCartDrawer, toggleSearchOverlay, setCategoryFilter, resetFilters } = useApp();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === "/") {
        if (window.scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        setIsScrolled(true);
      }
    };

    // Initialize scrolled state based on route
    if (pathname !== "/") {
      setIsScrolled(true);
    } else {
      setIsScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleCategoryLink = (category: string) => {
    resetFilters();
    if (category !== "all") {
      setCategoryFilter(category);
    }
    router.push("/catalog");
  };

  const showAccountAlert = () => {
    alert("D-BLAQ Accounts portal is temporarily undergoing regular system maintenance. Guest checkout remains fully operational!");
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="header-wrapper" className={`header-wrapper ${isScrolled ? "scrolled" : ""}`}>
      <header>
        <div className="logo">
          <Link href="/">
            <h1>D-BLAQ</h1>
          </Link>
        </div>

        <nav className="nav-menu">
          <button className="nav-link" onClick={() => handleCategoryLink("t-shirt")}>
            T-Shirt
          </button>
          <button className="nav-link" onClick={() => handleCategoryLink("shirts")}>
            Shirts
          </button>
          <button className="nav-link" onClick={() => handleCategoryLink("all")}>
            Shop All
          </button>
          <button className="nav-link" onClick={() => handleCategoryLink("all")}>
            New Arrivals
          </button>
          <button className="nav-link" onClick={() => handleCategoryLink("all")}>
            Special Prices
          </button>
        </nav>

        <div className="nav-icons">
          <button
            id="search-btn"
            className="icon-btn"
            aria-label="Search"
            onClick={() => toggleSearchOverlay(true)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            id="account-btn"
            className="icon-btn"
            aria-label="Account"
            onClick={showAccountAlert}
          >
            <svg viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button
            id="cart-btn"
            className="icon-btn"
            aria-label="Cart"
            onClick={() => toggleCartDrawer(true)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span id="cart-count-badge" className="cart-badge">
              {totalItems}
            </span>
          </button>
          <Link href="/catalog" className="outlet-btn" onClick={resetFilters}>
            Outlet
          </Link>
        </div>
      </header>
    </div>
  );
};
export default Header;
