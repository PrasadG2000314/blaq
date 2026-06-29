"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useApp } from "@/context/AppContext";

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const { addToCart, toggleCartDrawer } = useApp();

  // Detail interactive states
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>(product.images[0]);
  const [activeAccordion, setActiveAccordion] = useState<string>("specifications");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Reset main image if product changes
  useEffect(() => {
    setMainImage(product.images[0]);
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
  }, [product]);

  // Installment calculations
  const inst3 = (product.price / 3).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const inst4 = (product.price / 4).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;

    setIsAdding(true);
    // Mimic the 800ms visual add delay
    setTimeout(() => {
      addToCart(product, selectedColor, selectedSize, quantity);
      setIsAdding(false);
      toggleCartDrawer(true);
    }, 800);
  };

  const copyUrlToClipboard = () => {
    if (typeof window !== "undefined") {
      const dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.value = window.location.origin + `/product/${product.id}`;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      alert("Product URL copied to clipboard!");
    }
  };

  const clearSwatches = () => {
    setSelectedColor(null);
    setSelectedSize(null);
  };

  // Swatch Availability Rules
  const isColorDisabled = (color: string) => {
    if (!selectedSize) return false;
    const stock = product.variations.stock[`${color}_${selectedSize}`];
    return stock === 0 || stock === undefined;
  };

  const isSizeDisabled = (size: string) => {
    if (!selectedColor) return false;
    const stock = product.variations.stock[`${selectedColor}_${size}`];
    return stock === 0 || stock === undefined;
  };

  // Get active stock for selections
  let stockMessage = "";
  let isInStock = false;
  let isAddBtnDisabled = true;

  if (selectedColor && selectedSize) {
    const key = `${selectedColor}_${selectedSize}`;
    const stock = product.variations.stock[key] || 0;
    if (stock > 0) {
      stockMessage = `${stock} in stock`;
      isInStock = true;
      isAddBtnDisabled = false;
    } else {
      stockMessage = "Out of stock";
      isInStock = false;
      isAddBtnDisabled = true;
    }
  }

  return (
    <div className="product-detail-container section-padding">
      {/* Left Column: Gallery thumbnails + main */}
      <div className="product-gallery-section">
        <div className="gallery-thumbnails">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className={`thumb-item ${mainImage === img ? "active" : ""}`}
              onClick={() => setMainImage(img)}
              alt={`${product.title} Thumb ${idx + 1}`}
            />
          ))}
        </div>
        <div className="gallery-main-viewport">
          <img src={mainImage} className="gallery-main-img" alt={product.title} />
        </div>
      </div>

      {/* Right Column: Info options & pricing */}
      <div className="product-detail-info">
        <div className="breadcrumbs">
          <Link href="/">Home</Link> / <Link href="/catalog">Shop</Link> / <span>{product.title}</span>
        </div>
        <span className="detail-category">{product.subTitle}</span>
        <h1 className="detail-title">{product.title}</h1>

        <div className="detail-price-row">
          <span className={`detail-price ${product.originalPrice ? "sale-price" : ""}`}>
            Rs. {product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && (
            <span className="detail-old-price" style={{ display: "inline-block" }}>
              Rs. {product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        <p style={{ fontSize: "14px", opacity: 0.75, marginBottom: "10px" }}>
          {product.description}
        </p>

        {/* Color Swatch Group */}
        <div className="swatch-group">
          <div className="swatch-group-title">
            Color: <span className="selected-value">{selectedColor || "Select Color"}</span>
          </div>
          <div className="swatch-options">
            {product.variations.colors.map((color) => {
              const disabled = isColorDisabled(color);
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  className={`swatch-btn ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Swatch Group */}
        <div className="swatch-group">
          <div className="swatch-group-title">
            Size: <span className="selected-value">{selectedSize || "Select Size"}</span>
          </div>
          <div className="swatch-options">
            {product.variations.sizes.map((size) => {
              const disabled = isSizeDisabled(size);
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  className={`swatch-btn ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {(selectedColor || selectedSize) && (
          <button
            className="clear-swatches-btn"
            style={{ display: "inline-block" }}
            onClick={clearSwatches}
          >
            Clear Selections
          </button>
        )}

        {selectedColor && selectedSize && (
          <div
            className={`stock-status-msg ${isInStock ? "in-stock" : "out-of-stock"}`}
            style={{ display: "block" }}
          >
            {stockMessage}
          </div>
        )}

        {/* Add to Cart Actions */}
        <div className="detail-actions-row">
          <div className="detail-qty-spinner">
            <button className="detail-qty-btn" onClick={() => handleQuantityChange(-1)}>
              -
            </button>
            <div className="detail-qty-val">{quantity}</div>
            <button className="detail-qty-btn" onClick={() => handleQuantityChange(1)}>
              +
            </button>
          </div>
          <button
            className="btn-primary detail-add-to-cart"
            disabled={isAddBtnDisabled || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? "Adding..." : "Add to Bag"}
          </button>
        </div>

        {/* BNPL Widget details */}
        <div className="detail-bnpl-container">
          <div className="detail-bnpl-title">Available Installment Schemes</div>
          <div className="detail-bnpl-row">
            <div className="detail-bnpl-partner">
              <strong>Mintpay</strong> Pay in 3 installments
            </div>
            <span>Rs. {inst3} x 3</span>
          </div>
          <div className="detail-bnpl-row">
            <div className="detail-bnpl-partner">
              <strong>Koko</strong> Pay in 3 installments
            </div>
            <span>Rs. {inst3} x 3</span>
          </div>
          <div className="detail-bnpl-row">
            <div className="detail-bnpl-partner">
              <strong>Payzy</strong> Up to 4 interest-free payments
            </div>
            <span>Rs. {inst4} x 4</span>
          </div>
        </div>

        {/* Accordions */}
        <div className="detail-accordions">
          <div
            className={`accordion-item ${activeAccordion === "specifications" ? "active" : ""}`}
            onClick={() => setActiveAccordion(activeAccordion === "specifications" ? "" : "specifications")}
          >
            <div className="accordion-header">
              Product Specifications
              <span className="accordion-icon">{activeAccordion === "specifications" ? "-" : "+"}</span>
            </div>
            <div className="accordion-body">
              <p>
                100% Organic heavyweight combed cotton blend (240 GSM). Preshrunk, soft-wash treated,
                and features heavy flat-stitch seam joins. Dry clean or machine wash cold.
              </p>
            </div>
          </div>
          <div
            className={`accordion-item ${activeAccordion === "shipping" ? "active" : ""}`}
            onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")}
          >
            <div className="accordion-header">
              Shipping & Returns
              <span className="accordion-icon">{activeAccordion === "shipping" ? "-" : "+"}</span>
            </div>
            <div className="accordion-body">
              <p>
                Delivery is completed island-wide within 2-4 working days (Rs. 400.00 standard rate).
                Return or exchange requests can be processed within 14 days from receipt, provided tags
                remain attached and condition is pristine.
              </p>
            </div>
          </div>
        </div>

        {/* Social Shares */}
        <div className="share-links-row">
          <span className="share-label">Share:</span>
          <button
            className="share-btn-item"
            title="Facebook"
            onClick={() => alert("Shared on Facebook")}
          >
            <svg viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
            </svg>
          </button>
          <button className="share-btn-item" title="Twitter" onClick={() => alert("Shared on X")}>
            <svg viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </button>
          <button className="share-btn-item" title="Copy Link" onClick={copyUrlToClipboard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailClient;
