"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/products";

// Color name to hex mappings
export const getColorHex = (colorName: string): string => {
  const mapping: { [key: string]: string } = {
    "Black": "#000000",
    "Navy": "#1a2c4c",
    "Beige": "#d9c4b1",
    "White/Blue": "#e0ecf8",
    "Grey/Black": "#4f4f4f",
    "Vintage Wash": "#3a3d40",
    "Charcoal": "#2b2b2b",
    "Navy Stripe": "#26354a",
    "Beige Stripe": "#e2d2bd",
    "Off-White": "#faf6f0",
    "Sage Green": "#879883",
    "White": "#ffffff",
    "Olive": "#556b2f",
    "Indigo Wash": "#4c668c",
    "Jet Black": "#0b0c10",
    "Dark Green": "#0e2d1d",
    "Khaki": "#c3b091"
  };
  return mapping[colorName] || "#cccccc";
};

export const FilterDrawer: React.FC = () => {
  const {
    isFilterOpen,
    toggleFilterDrawer,
    catalogFilters,
    setCategoryFilter,
    toggleColorFilter,
    handlePriceRangeChange,
    resetFilters
  } = useApp();

  // Dynamic counts calculation
  const counts = {
    all: PRODUCTS.length,
    "t-shirt": PRODUCTS.filter((p) => p.category === "t-shirt").length,
    "shirts": PRODUCTS.filter((p) => p.category === "shirts").length,
    "hoodies": PRODUCTS.filter((p) => p.category === "hoodies").length,
    "joggers": PRODUCTS.filter((p) => p.category === "joggers").length,
    "jeans": PRODUCTS.filter((p) => p.category === "jeans").length,
    "polo-t-shirt": PRODUCTS.filter((p) => p.category === "polo-t-shirt").length,
    "caps-and-hats": PRODUCTS.filter((p) => p.category === "caps-and-hats").length
  };

  // Get unique colors list
  const uniqueColors = Array.from(
    new Set(PRODUCTS.flatMap((p) => p.variations.colors))
  );

  return (
    <div id="filter-drawer" className={`overlay-panel ${isFilterOpen ? "active" : ""}`}>
      <div className="panel-header">
        <span className="panel-title">Filter Products</span>
        <button
          className="panel-close"
          aria-label="Close"
          onClick={() => toggleFilterDrawer(false)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="panel-body">
        {/* Category Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Product Categories</h4>
          <ul className="filter-list">
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "all" ? "active" : ""}`}
                onClick={() => setCategoryFilter("all")}
              >
                Shop All <span className="filter-count">({counts.all})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "t-shirt" ? "active" : ""}`}
                onClick={() => setCategoryFilter("t-shirt")}
              >
                T-Shirts <span className="filter-count">({counts["t-shirt"]})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "shirts" ? "active" : ""}`}
                onClick={() => setCategoryFilter("shirts")}
              >
                Shirts <span className="filter-count">({counts["shirts"]})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "hoodies" ? "active" : ""}`}
                onClick={() => setCategoryFilter("hoodies")}
              >
                Hoodies <span className="filter-count">({counts["hoodies"]})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "joggers" ? "active" : ""}`}
                onClick={() => setCategoryFilter("joggers")}
              >
                Joggers <span className="filter-count">({counts["joggers"]})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "jeans" ? "active" : ""}`}
                onClick={() => setCategoryFilter("jeans")}
              >
                Jeans <span className="filter-count">({counts["jeans"]})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "polo-t-shirt" ? "active" : ""}`}
                onClick={() => setCategoryFilter("polo-t-shirt")}
              >
                Polo Shirts <span className="filter-count">({counts["polo-t-shirt"]})</span>
              </button>
            </li>
            <li>
              <button
                className={`filter-btn ${catalogFilters.category === "caps-and-hats" ? "active" : ""}`}
                onClick={() => setCategoryFilter("caps-and-hats")}
              >
                Caps & Accessories <span className="filter-count">({counts["caps-and-hats"]})</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Color Swatch Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Filter by Color</h4>
          <div className="color-swatch-list" id="filter-colors-container">
            {uniqueColors.map((color) => {
              const hex = getColorHex(color);
              const isActive = catalogFilters.color === color;
              return (
                <button
                  key={color}
                  className={`color-swatch-item ${isActive ? "active" : ""}`}
                  title={color}
                  style={{ backgroundColor: hex }}
                  onClick={() => toggleColorFilter(color)}
                />
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Filter by Price</h4>
          <div className="price-range-wrapper">
            <input
              type="range"
              id="price-slider"
              className="price-slider-input"
              min="1000"
              max="8000"
              step="100"
              value={catalogFilters.maxPrice}
              onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
            />
            <div className="price-range-labels">
              <span>Min: Rs. 1,000</span>
              <span>
                Max:{" "}
                <span id="price-slider-val-label">
                  Rs. {catalogFilters.maxPrice.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: "20px" }}
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
export default FilterDrawer;
