"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

interface Slide {
  bg: string;
  subtitle: string;
  title: string;
  description: string;
  category: string;
}

const SLIDES: Slide[] = [
  {
    bg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    subtitle: "BUBBLE KNIT",
    title: "T-SHIRTS",
    description: "Shop our newest collection of bubble knit tees, available in oversized and regular fits.",
    category: "t-shirt"
  },
  {
    bg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1600&q=80",
    subtitle: "CHOOSE YOUR FIT",
    title: "REGULAR TO OVERSIZED FITS",
    description: "Find your unique silhouette in our collection of relaxed and heavyweight cotton tees.",
    category: "all"
  },
  {
    bg: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=80",
    subtitle: "BUTTON DOWN SHIRTS",
    title: "SHIRTS",
    description: "Explore our collection of striped and textured linen shirts, ideal for any occasion.",
    category: "shirts"
  },
  {
    bg: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1600&q=80",
    subtitle: "FINISHING TOUCHES",
    title: "CAPS & ACCESSORIES",
    description: "Complete your streetwear profile with our minimal, adjustable cotton caps.",
    category: "caps-and-hats"
  }
];

export const Home: React.FC = () => {
  const router = useRouter();
  const { setCategoryFilter, resetFilters } = useApp();

  // Slider state
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Newsletter Modal state
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupEmail, setPopupEmail] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  // Slide autoplay effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Show newsletter promo after 1.5 seconds delay on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const isSubscribed = localStorage.getItem("dblaq_subscribed");
      if (!isSubscribed) {
        setShowPopup(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryNav = (cat: string) => {
    resetFilters();
    if (cat !== "all") {
      setCategoryFilter(cat);
    }
    router.push("/catalog");
  };

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("dblaq_subscribed", "true");
    alert("Subscription Successful! Enter Coupon Code 'BLAQ10' inside your bag drawer for 10% off your purchase.");
    setShowPopup(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing! Check your email inbox for style drops soon.");
    setNewsletterEmail("");
  };

  const handleGiftCardAlert = () => {
    alert("Electronic Gift Card certificates will launch on our store soon! Stay tuned.");
  };

  const featuredProducts = PRODUCTS.slice(0, 5);

  return (
    <main id="home-view" className="view-section active" style={{ display: "block" }}>
      {/* 1. Hero Slider */}
      <section className="hero-slider">
        <div id="slider-container" className="slider-container">
          {SLIDES.map((slide, idx) => (
            <div key={idx} className={`slide ${idx === currentSlide ? "active" : ""}`}>
              <div className="slide-bg" style={{ backgroundImage: `url(${slide.bg})` }} />
              <div className="slide-content">
                <span className="slide-subtitle">{slide.subtitle}</span>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
                <button className="btn-primary" onClick={() => handleCategoryNav(slide.category)}>
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="slider-dots">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
            >
              0{idx + 1}
            </span>
          ))}
        </div>

        {/* Fixed bottom layout links overlaying slider */}
        <div className="slider-bottom-bar">
          <button className="bottom-bar-link" onClick={() => handleCategoryNav("all")}>
            Promotions
          </button>
          <button className="bottom-bar-link" onClick={() => handleCategoryNav("all")}>
            New Arrivals
          </button>
        </div>
      </section>

      {/* 2. Grid Categories (Split 1) */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2col">
            <div className="category-card" onClick={() => handleCategoryNav("polo-t-shirt")}>
              <img
                src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80"
                alt="Polo T-shirts"
                className="category-img"
              />
              <div className="category-info">
                <span className="category-label">New In</span>
                <h3 className="category-title">Polo T-Shirts</h3>
                <p className="category-subtitle">Sleek Tapered Fits</p>
              </div>
            </div>
            <div className="category-card" onClick={() => handleCategoryNav("hoodies")}>
              <img
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
                alt="Hoodies"
                className="category-img"
              />
              <div className="category-info">
                <span className="category-label">New In</span>
                <h3 className="category-title">Hoodies</h3>
                <p className="category-subtitle">Heavy fleece loungewear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sale Promotion Banner */}
      <section>
        <div className="promo-banner">
          <div
            className="promo-bg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80')"
            }}
          />
          <div className="promo-content">
            <span className="promo-tag">LIMITED OFFERS</span>
            <h2 className="promo-title">UPTO 70% SALE</h2>
            <p className="promo-text">
              Limited pieces available for a limited time only. Make your choice before it&apos;s too late.
            </p>
            <button className="btn-primary" onClick={() => handleCategoryNav("all")}>
              Shop Sale
            </button>
          </div>
        </div>
      </section>

      {/* 4. Grid Categories (Split 2) */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2col">
            <div className="category-card" onClick={() => handleCategoryNav("joggers")}>
              <img
                src="https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=800&q=80"
                alt="Joggers"
                className="category-img"
              />
              <div className="category-info">
                <span className="category-label">Hot</span>
                <h3 className="category-title">Joggers</h3>
                <p className="category-subtitle">Flex in comfort</p>
              </div>
            </div>
            <div className="category-card" onClick={() => handleCategoryNav("jeans")}>
              <img
                src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
                alt="Jeans"
                className="category-img"
              />
              <div className="category-info">
                <span className="category-label">Icon</span>
                <h3 className="category-title">Jeans</h3>
                <p className="category-subtitle">Your everyday edge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Showcase List ("JUST IN") */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-light-gray)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Just In</h2>
            <button className="btn-secondary" onClick={() => handleCategoryNav("all")}>
              Shop All
            </button>
          </div>
          <div id="home-products-grid" className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Gift Card Promo Banner */}
      <section>
        <div className="promo-banner" style={{ backgroundColor: "#121212" }}>
          <div
            className="promo-bg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1600&q=80')",
              opacity: 0.35
            }}
          />
          <div className="promo-content">
            <span className="promo-tag">EXCLUSIVE Gifting</span>
            <h2 className="promo-title">GIFT CARD</h2>
            <p className="promo-text">
              Don’t know their size or favorite color? Let them pick. Send a D-BLAQ electronic gift
              card instantly.
            </p>
            <button className="btn-primary" onClick={handleGiftCardAlert}>
              Get a Gift Card
            </button>
          </div>
        </div>
      </section>

      {/* 7. Return & Delivery Info Bars */}
      <section className="container">
        <div className="info-row">
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="info-title">14 Days Returns</h4>
              <p className="info-desc">You have 14 days to exchange your item.</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h10zm0 0h4l4-4v-4h-8v8z" />
              </svg>
            </div>
            <div>
              <h4 className="info-title">Island-wide Delivery</h4>
              <p className="info-desc">Fast courier service direct to your doorstep.</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="info-title">Secured Checkout</h4>
              <p className="info-desc">Visa, Mastercard, BNPL installments supported.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="section-padding newsletter-section">
        <div className="container newsletter-container">
          <div className="newsletter-info">
            <h2 className="newsletter-title">Get 10% Off</h2>
            <p className="newsletter-desc">
              Subscribe to our street updates list. Recieve early product drops announcements and
              get 10% off your first purchase.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Your Email Address"
              required
              className="newsletter-input"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 9. OVERLAY POPUPS (Promo Newsletter Popup on load) */}
      {showPopup && (
        <>
          <div
            id="newsletter-popup-backdrop"
            className="popup-modal-backdrop active"
            onClick={() => setShowPopup(false)}
          />
          <div id="newsletter-popup" className="popup-modal active">
            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
              aria-label="Close Newsletter Offer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="popup-img-side" />
            <div className="popup-content-side">
              <span className="popup-tag">Special Welcome Offer</span>
              <h3 className="popup-title">STREETWEAR INSIDER</h3>
              <p className="popup-desc">
                Subscribe to receive early notifications on drops, special pricing restocks, and claim a{" "}
                <strong>10% DISCOUNT CODE</strong> code instantly.
              </p>
              <form className="popup-form" onSubmit={handlePopupSubmit}>
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="popup-input"
                  id="popup-email-input"
                  value={popupEmail}
                  onChange={(e) => setPopupEmail(e.target.value)}
                />
                <button type="submit" className="btn-primary popup-btn">
                  Reveal Coupon Code
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </main>
  );
};
export default Home;
