"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const Footer: React.FC = () => {
  const router = useRouter();
  const { setCategoryFilter, resetFilters } = useApp();

  const handleFooterLink = (category: string) => {
    resetFilters();
    if (category !== "all") {
      setCategoryFilter(category);
    }
    router.push("/catalog");
  };

  const showAccountAlert = () => {
    alert("D-BLAQ Accounts portal is temporarily undergoing regular system maintenance. Guest checkout remains fully operational!");
  };

  const showTermsAlert = (sectionName: string) => {
    alert(`You clicked the footer link for "${sectionName}". The detailed terms and conditions document is linked on the standard D-Blaq policy logs.`);
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/catalog" onClick={resetFilters}>
                  Shop All Products
                </Link>
              </li>
              <li>
                <button onClick={() => handleFooterLink("all")}>New Street Drops</button>
              </li>
              <li>
                <button onClick={() => handleFooterLink("all")}>Special Sales</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Information</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => showTermsAlert("About Us")}>About Us</button>
              </li>
              <li>
                <button onClick={() => showTermsAlert("Contact")}>Contact Us</button>
              </li>
              <li>
                <button onClick={() => showTermsAlert("Returns Policy")}>Shipping & Returns</button>
              </li>
              <li>
                <button onClick={() => showTermsAlert("Terms & Conditions")}>Terms & Conditions</button>
              </li>
              <li>
                <button onClick={() => showTermsAlert("FAQ")}>FAQ</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">My Account</h4>
            <ul className="footer-links">
              <li>
                <button onClick={showAccountAlert}>Login</button>
              </li>
              <li>
                <button onClick={showAccountAlert}>Register</button>
              </li>
              <li>
                <button onClick={showAccountAlert}>My Orders</button>
              </li>
              <li>
                <button onClick={showAccountAlert}>Wishlist</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Connect with Us</h4>
            <p style={{ fontSize: "13px", opacity: 0.6, marginBottom: "15px" }}>
              Follow us on social networks for style guides and exclusive discounts.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                <svg viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.69 4.14.93.97 2.21 1.6 3.56 1.77v3.74a8.55 8.55 0 01-4.75-1.57c-.11.7-.17 1.43-.17 2.15 0 3.86-2.5 7.42-6.24 8.44A8.78 8.78 0 012.33 13.9a8.6 8.6 0 014.22-9.75v3.83a4.78 4.78 0 00-2.73 4.34A4.85 4.85 0 008.7 17.2a4.85 4.85 0 004.88-4.78c.02-4.14.01-8.28.02-12.4m.02.02h-.04v.04c0 4.13.01 8.26-.02 12.39a4.82 4.82 0 01-3.66 4.67 4.79 4.79 0 01-5.18-2.6 4.77 4.77 0 011.66-5.59c.14.07.28.14.43.2l.06.03c.59.27 1.09.7 1.48 1.23a8.68 8.68 0 011.02-3.1 8.35 8.35 0 00-4.01 9.53 8.54 8.54 0 008.3 6.35c3.67-.09 6.84-2.58 7.74-6.14.3-.92.36-1.92.32-2.88.02-.38.03-.76.03-1.14 0-1.28.27-2.54.78-3.71.74-.03 1.48-.16 2.19-.38a8.3 8.3 0 001.37-.58v-3.7a8.57 8.57 0 01-3.23-1.39A8.74 8.74 0 0116.51 0c-1.32.01-2.64.01-3.96.02v.02z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; Copyright D-BLAQ 2026. All rights reserved.</p>
          <p>Crafted in high quality combed cotton for street prestige.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
