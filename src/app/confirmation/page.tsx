"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

interface OrderDetails {
  reference: string;
  date: string;
  paymentMethod: string;
  total: string;
}

export const Confirmation: React.FC = () => {
  const { clearCart } = useApp();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Load order details on mount and clear active shopping bag
  useEffect(() => {
    const savedOrder = sessionStorage.getItem("dblaq_order");
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Failed to parse order info", e);
      }
    }
    // Clear shopping cart
    clearCart();
  }, []);

  return (
    <div className="view-section active" style={{ display: "block", paddingTop: "var(--header-height)", minHeight: "80vh" }}>
      <div className="container section-padding" style={{ marginTop: "40px" }}>
        <div className="confirmation-box">
          <div className="success-icon-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="confirmation-title">Thank You!</h1>
          <p className="confirmation-desc">
            Your order has been successfully placed. A confirmation email and tracking link will be
            sent shortly.
          </p>

          <div className="order-details-summary">
            <div className="order-details-title">Order Information</div>
            <div className="order-detail-row">
              <strong>Order Reference:</strong>
              <span id="confirm-ref">{order?.reference || "#DB-XXXXX"}</span>
            </div>
            <div className="order-detail-row">
              <strong>Date:</strong>
              <span id="confirm-date">{order?.date || "June 29, 2026"}</span>
            </div>
            <div className="order-detail-row">
              <strong>Payment Method:</strong>
              <span id="confirm-payment">{order?.paymentMethod || "Cash On Delivery"}</span>
            </div>
            <div className="order-detail-row">
              <strong>Grand Total:</strong>
              <span id="confirm-total" style={{ fontWeight: 700 }}>
                {order?.total || "Rs. 0.00"}
              </span>
            </div>
          </div>

          <Link href="/" className="btn-primary" style={{ display: "inline-block" }}>
            Return To Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Confirmation;
