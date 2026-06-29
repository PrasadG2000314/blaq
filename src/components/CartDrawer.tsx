"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    appliedCoupon,
    isCartOpen,
    toggleCartDrawer,
    updateCartItemQty,
    removeFromCart,
    applyCoupon
  } = useApp();

  const [couponCode, setCouponCode] = useState<string>("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCouponExpanded, setIsCouponExpanded] = useState<boolean>(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountVal = 0;
  if (appliedCoupon) {
    discountVal = subtotal * appliedCoupon.rate;
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage({ text: "Please enter a coupon code.", isError: true });
      return;
    }
    const result = applyCoupon(couponCode);
    setCouponMessage({ text: result.message, isError: !result.success });
  };

  const handleCheckout = () => {
    toggleCartDrawer(false);
    router.push("/checkout");
  };

  return (
    <div id="cart-drawer" className={`overlay-panel ${isCartOpen ? "active" : ""}`}>
      <div className="panel-header">
        <span className="panel-title">Shopping Bag ({totalItems})</span>
        <button
          className="panel-close"
          aria-label="Close"
          onClick={() => toggleCartDrawer(false)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="panel-body" id="cart-drawer-body">
        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <svg viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p>Your shopping bag is empty.</p>
            <button
              className="btn-primary"
              style={{ marginTop: "20px", fontSize: "11px" }}
              onClick={() => {
                toggleCartDrawer(false);
                router.push("/catalog");
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-items-list">
            {cart.map((item, idx) => (
              <div className="cart-item" key={`${item.id}_${item.selectedColor}_${item.selectedSize}`}>
                <img src={item.image} className="cart-item-img" alt={item.title} />
                <div className="cart-item-info">
                  <div>
                    <h4 className="cart-item-title">{item.title}</h4>
                    <p className="cart-item-meta">
                      Color: {item.selectedColor} | Size: {item.selectedSize}
                    </p>
                  </div>

                  <div className="cart-item-quantity-row">
                    <div className="qty-spinner">
                      <button
                        className="qty-btn"
                        onClick={() => updateCartItemQty(idx, -1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateCartItemQty(idx, 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">
                      Rs. {(item.price * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <>
          <div className="coupon-drawer" id="mini-coupon-drawer" style={{ display: "block" }}>
            <div
              className={`coupon-drawer-toggle ${isCouponExpanded ? "expanded" : ""}`}
              id="coupon-toggle"
              onClick={() => setIsCouponExpanded(!isCouponExpanded)}
            >
              Have a Promo Code? {isCouponExpanded ? "▲" : "▼"}
            </div>
            <div className={`coupon-drawer-content ${isCouponExpanded ? "active" : ""}`} id="coupon-content">
              <input
                type="text"
                id="cart-coupon-input"
                className="coupon-input"
                placeholder="Enter coupon (e.g. BLAQ10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="coupon-apply-btn" onClick={handleApplyCoupon}>
                Apply
              </button>
            </div>
            {couponMessage && (
              <div
                id="cart-coupon-msg"
                className={`coupon-msg ${couponMessage.isError ? "error" : "success"}`}
                style={{ display: "block" }}
              >
                {couponMessage.text}
              </div>
            )}
          </div>

          <div className="panel-footer" id="cart-drawer-footer" style={{ display: "flex" }}>
            <div className="summary-row">
              <span>Subtotal</span>
              <span id="cart-subtotal" className="cart-subtotal-price">
                Rs. {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {appliedCoupon && (
              <div className="summary-row" id="cart-discount-row" style={{ display: "flex" }}>
                <span>Discount ({appliedCoupon.code})</span>
                <span className="cart-discount" id="cart-discount-val">
                  -Rs. {discountVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "18px" }}
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default CartDrawer;
