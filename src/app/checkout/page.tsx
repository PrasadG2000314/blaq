"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const Checkout: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    appliedCoupon,
    checkoutPaymentMethod,
    setCheckoutPaymentMethod
  } = useApp();

  // Form input states
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [apartment, setApartment] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [postal, setPostal] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState<string>("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountVal = 0;
  if (appliedCoupon) {
    discountVal = subtotal * appliedCoupon.rate;
  }
  const shipping = 400;
  const total = subtotal - discountVal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Save order information in sessionStorage to display on confirmation page
    const orderDetails = {
      reference: `#DB-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      paymentMethod: getPaymentMethodLabel(checkoutPaymentMethod),
      total: `Rs. ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    };

    sessionStorage.setItem("dblaq_order", JSON.stringify(orderDetails));

    // Order Placement (state clearing will happen on confirmation view mount or after submission)
    router.push("/confirmation");
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash On Delivery (COD)";
      case "mintpay":
        return "Mintpay Installments";
      case "koko":
        return "Koko BNPL";
      case "webxpay":
        return "Credit / Debit Card (WebXPay)";
      default:
        return "Cash On Delivery (COD)";
    }
  };

  if (cart.length === 0) {
    return (
      <div className="view-section active" style={{ display: "block", paddingTop: "var(--header-height)", minHeight: "80vh" }}>
        <div className="container section-padding" style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>Your shopping bag is empty</h2>
          <p style={{ opacity: 0.6, margin: "20px 0" }}>
            Add items to your bag before proceeding to checkout.
          </p>
          <Link href="/catalog" className="btn-primary" style={{ display: "inline-block" }}>
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="view-section active" style={{ display: "block", paddingTop: "var(--header-height)" }}>
      <div className="container section-padding" style={{ marginTop: "40px" }}>
        {/* Steps Indicator */}
        <div className="checkout-steps">
          <div className="step-item completed">
            <span
              style={{
                fontWeight: 900,
                backgroundColor: "var(--color-green)",
                color: "var(--color-white)",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✓
            </span>
            Shopping Bag
          </div>
          <div className="step-divider" />
          <div className="step-item active">
            <span
              style={{
                border: "2px solid var(--color-black)",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              2
            </span>
            Shipping & Checkout
          </div>
          <div className="step-divider" />
          <div className="step-item">
            <span
              style={{
                border: "2px solid #ccc",
                color: "#ccc",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              3
            </span>
            Confirmation
          </div>
        </div>

        {/* Split Layout */}
        <div className="checkout-grid">
          {/* Billing Details Form */}
          <div className="checkout-form-section">
            <h2 className="checkout-section-title">Billing & Shipping Details</h2>
            <form id="checkout-details-form" onSubmit={handlePlaceOrder}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first-name">First Name *</label>
                  <input
                    type="text"
                    id="first-name"
                    className="form-input"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last-name">Last Name *</label>
                  <input
                    type="text"
                    id="last-name"
                    className="form-input"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group full-width" style={{ marginBottom: "20px" }}>
                <label htmlFor="street-address">Street Address *</label>
                <input
                  type="text"
                  id="street-address"
                  className="form-input"
                  placeholder="House number and street name"
                  required
                  style={{ marginBottom: "10px" }}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <input
                  type="text"
                  id="apartment-address"
                  className="form-input"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="checkout-town">Town / City *</label>
                  <input
                    type="text"
                    id="checkout-town"
                    className="form-input"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-postal">Postal Code / Zip (optional)</label>
                  <input
                    type="text"
                    id="checkout-postal"
                    className="form-input"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="checkout-phone">Phone *</label>
                  <input
                    type="tel"
                    id="checkout-phone"
                    className="form-input"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-email">Email Address *</label>
                  <input
                    type="email"
                    id="checkout-email"
                    className="form-input"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="form-group full-width"
                style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input type="checkbox" id="create-account-flag" style={{ width: "16px", height: "16px" }} />
                <label htmlFor="create-account-flag" style={{ marginBottom: 0, cursor: "pointer" }}>
                  Create an account?
                </label>
              </div>

              <div className="form-group full-width">
                <label htmlFor="order-notes">Order Notes (optional)</label>
                <textarea
                  id="order-notes"
                  className="form-input"
                  style={{ height: "100px", padding: "10px", resize: "none" }}
                  placeholder="Notes about your delivery, e.g. special directions for courier."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Order Summary & Payments Panel */}
          <div>
            <div className="order-summary-box">
              <h2 className="checkout-section-title">Your Order</h2>

              <div className="summary-items-list" id="checkout-summary-items">
                {cart.map((item) => (
                  <div key={`${item.id}_${item.selectedColor}_${item.selectedSize}`} className="summary-item-card">
                    <img src={item.image} className="summary-item-img" alt={item.title} />
                    <div className="summary-item-info">
                      <h4 className="summary-item-title">{item.title}</h4>
                      <p className="summary-item-meta">
                        Color: {item.selectedColor} | Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="summary-item-price">
                      Rs. {(item.price * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>
                <div className="summary-row" style={{ marginBottom: "10px" }}>
                  <span>Subtotal</span>
                  <span id="checkout-subtotal">
                    Rs. {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="summary-row" id="checkout-discount-row" style={{ marginBottom: "10px", display: "flex" }}>
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="cart-discount" id="checkout-discount-val">
                      -Rs. {discountVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="summary-row" style={{ marginBottom: "10px" }}>
                  <span>Shipping</span>
                  <span id="checkout-shipping">
                    Rs. {shipping.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="summary-total-row">
                  <span>Total</span>
                  <span id="checkout-total">
                    Rs. {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payments Box */}
              <div className="payment-methods-box">
                <h3 className="footer-col-title" style={{ marginBottom: "10px" }}>
                  Payment Method
                </h3>

                {/* Cash on Delivery */}
                <div
                  className={`payment-option ${checkoutPaymentMethod === "cod" ? "active" : ""}`}
                  onClick={() => setCheckoutPaymentMethod("cod")}
                >
                  <div className="payment-option-header">
                    <input
                      type="radio"
                      name="payment-group"
                      id="pay-cod"
                      checked={checkoutPaymentMethod === "cod"}
                      onChange={() => {}}
                      style={{ cursor: "pointer" }}
                    />
                    Cash On Delivery (COD)
                  </div>
                  <div className="payment-option-desc">
                    Pay with cash upon receipt of delivery at your doorstep. Standard carrier fees apply.
                  </div>
                </div>

                {/* Mintpay */}
                <div
                  className={`payment-option ${checkoutPaymentMethod === "mintpay" ? "active" : ""}`}
                  onClick={() => setCheckoutPaymentMethod("mintpay")}
                >
                  <div className="payment-option-header">
                    <input
                      type="radio"
                      name="payment-group"
                      id="pay-mintpay"
                      checked={checkoutPaymentMethod === "mintpay"}
                      onChange={() => {}}
                      style={{ cursor: "pointer" }}
                    />
                    Mintpay (3 Installments)
                  </div>
                  <div className="payment-option-desc">
                    Split your order amount into 3 interest-free installments with Mintpay. Debit or
                    Credit cards accepted.
                  </div>
                </div>

                {/* Koko */}
                <div
                  className={`payment-option ${checkoutPaymentMethod === "koko" ? "active" : ""}`}
                  onClick={() => setCheckoutPaymentMethod("koko")}
                >
                  <div className="payment-option-header">
                    <input
                      type="radio"
                      name="payment-group"
                      id="pay-koko"
                      checked={checkoutPaymentMethod === "koko"}
                      onChange={() => {}}
                      style={{ cursor: "pointer" }}
                    />
                    Koko (3 Installments)
                  </div>
                  <div className="payment-option-desc">
                    Pay in 3 interest-free installments via Koko BNPL app. Instantly approved.
                  </div>
                </div>

                {/* WebXPay Gateway */}
                <div
                  className={`payment-option ${checkoutPaymentMethod === "webxpay" ? "active" : ""}`}
                  onClick={() => setCheckoutPaymentMethod("webxpay")}
                >
                  <div className="payment-option-header">
                    <input
                      type="radio"
                      name="payment-group"
                      id="pay-webxpay"
                      checked={checkoutPaymentMethod === "webxpay"}
                      onChange={() => {}}
                      style={{ cursor: "pointer" }}
                    />
                    Visa / Mastercard / Amex
                  </div>
                  <div className="payment-option-desc">
                    Safe payment using your credit or debit card through the WebXPay secure merchant
                    payment gateway.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-details-form"
                className="btn-primary"
                style={{ width: "100%", height: "50px", marginTop: "30px" }}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
