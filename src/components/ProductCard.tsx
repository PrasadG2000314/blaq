"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  // Badges block
  const hasSale = !!product.originalPrice;
  const discount = hasSale && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const img1 = product.images[0];
  const img2 = product.images[1] || product.images[0];

  const installmentCost = Math.round(product.price / 3).toLocaleString();

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="product-media" onClick={handleNavigate}>
        <div className="product-badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isHot && <span className="badge badge-hot">Hot</span>}
          {hasSale && <span className="badge badge-sale">-{discount}%</span>}
        </div>
        <img src={img1} className="product-img" alt={product.title} loading="lazy" />
        <img src={img2} className="product-img hover-img" alt={product.title} loading="lazy" />
        <div className="product-actions-overlay">
          <button className="overlay-btn" onClick={(e) => { e.stopPropagation(); handleNavigate(); }}>
            Quick View
          </button>
          <button className="overlay-btn" onClick={(e) => { e.stopPropagation(); handleNavigate(); }}>
            Select Options
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-subtitle">{product.subTitle}</span>
        <h3 className="product-title">
          <Link href={`/product/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="product-price-row">
          {hasSale ? (
            <>
              <span className="product-price sale-price">
                Rs. {product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="product-old-price">
                Rs. {product.originalPrice?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </>
          ) : (
            <span className="product-price">
              Rs. {product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <div className="bnpl-widget">
          <span>
            Or 3 x <strong style={{ color: "var(--color-black)" }}>Rs. {installmentCost}</strong> with
          </span>
          <span className="bnpl-badge">Mintpay</span>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
