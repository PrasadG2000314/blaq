"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/products";

export const SearchOverlay: React.FC = () => {
  const router = useRouter();
  const { isSearchOpen, toggleSearchOverlay } = useApp();
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.value = "";
      setQuery("");
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleClose = () => {
    toggleSearchOverlay(false);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (!query.trim()) return false;
    const lowerQuery = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.subTitle.toLowerCase().includes(lowerQuery)
    );
  });

  const handleResultClick = (productId: string) => {
    handleClose();
    router.push(`/product/${productId}`);
  };

  return (
    <div id="search-overlay" className={`search-overlay ${isSearchOpen ? "active" : ""}`}>
      <div className="search-overlay-header">
        <div className="logo">
          <h1 style={{ color: "var(--color-black)" }}>D-BLAQ</h1>
        </div>
        <button
          className="panel-close"
          aria-label="Close Search"
          onClick={handleClose}
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div style={{ padding: "40px 0 10px 0" }}>
        <div className="search-input-wrapper">
          <span className="search-icon-inside">
            <svg viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            id="search-input-field"
            className="search-input-field"
            placeholder="Search products..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="search-results-area">
        <div className="search-results-list" id="search-results-container">
          {!query.trim() ? (
            <p style={{ textAlign: "center", opacity: 0.5, fontSize: "15px", marginTop: "40px" }}>
              Start typing to search streetwear apparel...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.5, fontSize: "15px", marginTop: "40px" }}>
              No products found matching &ldquo;{query}&rdquo;
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={() => handleResultClick(product.id)}
              >
                <img src={product.images[0]} className="search-result-img" alt={product.title} />
                <div>
                  <h4 className="search-result-title">{product.title}</h4>
                  <p style={{ fontSize: "12px", opacity: 0.6, textTransform: "uppercase" }}>
                    {product.subTitle}
                  </p>
                </div>
                <span className="search-result-price">
                  Rs. {product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchOverlay;
