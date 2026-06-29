"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const Catalog: React.FC = () => {
  const {
    catalogFilters,
    catalogSort,
    toggleFilterDrawer,
    handleCatalogSort
  } = useApp();

  const [columns, setColumns] = useState<number>(4);

  const getCategoryDisplayName = (cat: string) => {
    switch (cat) {
      case "t-shirt":
        return "T-Shirts";
      case "shirts":
        return "Shirts";
      case "hoodies":
        return "Hoodies";
      case "joggers":
        return "Joggers";
      case "jeans":
        return "Jeans";
      case "polo-t-shirt":
        return "Polo Shirts";
      case "caps-and-hats":
        return "Caps & Accessories";
      default:
        return "Shop All";
    }
  };

  // Filter products
  let filteredProducts = PRODUCTS.filter((p) => {
    // 1. Category check
    if (catalogFilters.category !== "all" && p.category !== catalogFilters.category) {
      return false;
    }
    // 2. Color check
    if (catalogFilters.color !== "all" && !p.variations.colors.includes(catalogFilters.color)) {
      return false;
    }
    // 3. Price check
    if (p.price > catalogFilters.maxPrice) {
      return false;
    }
    return true;
  });

  // Sort products
  if (catalogSort === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (catalogSort === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (catalogSort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div id="catalog-view" className="view-section active" style={{ display: "block", paddingTop: "var(--header-height)" }}>
      <div className="container" style={{ marginTop: "40px" }}>
        <div className="catalog-header">
          <div className="breadcrumbs">
            <Link href="/">Home</Link> / Shop All
          </div>
          <h1 className="section-title" id="catalog-title">
            {getCategoryDisplayName(catalogFilters.category)}
          </h1>

          <div className="catalog-controls">
            <button className="filter-trigger-btn" onClick={() => toggleFilterDrawer(true)}>
              <svg viewBox="0 0 24 24">
                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filter
            </button>

            <div className="layout-selectors">
              <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, opacity: 0.5 }}>
                Grid layout:
              </span>
              <button
                className={`layout-btn ${columns === 2 ? "active" : ""}`}
                onClick={() => setColumns(2)}
              >
                <span className="layout-dot" />
                <span className="layout-dot" />
              </button>
              <button
                className={`layout-btn ${columns === 3 ? "active" : ""}`}
                onClick={() => setColumns(3)}
              >
                <span className="layout-dot" />
                <span className="layout-dot" />
                <span className="layout-dot" />
              </button>
              <button
                className={`layout-btn ${columns === 4 ? "active" : ""}`}
                onClick={() => setColumns(4)}
              >
                <span className="layout-dot" />
                <span className="layout-dot" />
                <span className="layout-dot" />
                <span className="layout-dot" />
              </button>

              <select
                id="catalog-sort"
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "11px",
                  fontWeight: 700,
                  border: "1px solid var(--color-black)",
                  padding: "8px",
                  textTransform: "uppercase"
                }}
                value={catalogSort}
                onChange={(e) => handleCatalogSort(e.target.value)}
              >
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Average Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Grid List */}
        <div
          id="catalog-products-grid"
          className={`products-grid columns-${columns} section-padding`}
          style={{ paddingTop: 0 }}
        >
          {filteredProducts.length === 0 ? (
            <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px 0", opacity: 0.5 }}>
              No items found matching your filters.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Catalog;
