// D-BLAQ Client Application Logic
// State management, view router, slider, swatches variations validator, mini-cart, and checkout.

// App State
const state = {
  cart: [],
  appliedCoupon: null,
  currentView: 'home',
  catalogFilters: {
    category: 'all',
    color: 'all',
    maxPrice: 8000,
    search: ''
  },
  catalogSort: 'default',
  detailState: {
    product: null,
    selectedColor: null,
    selectedSize: null,
    quantity: 1
  },
  checkoutPaymentMethod: 'cod',
  currentSlideIndex: 0,
  slideAutoplayTimer: null
};

// Available Coupons
const COUPONS = {
  "BLAQ10": 0.10, // 10% off
  "STREET20": 0.20 // 20% off
};

// Page load initialization
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSliderAutoplay();
  initFilterSidebarColors();
  renderFeaturedShowcase();
  
  // Bind search backdrop closes
  document.getElementById('panel-backdrop').addEventListener('click', () => {
    toggleCartDrawer(false);
    toggleFilterDrawer(false);
  });

  // Open initial popup after 1.5 seconds delay
  setTimeout(() => {
    // Only show if user hasn't subscribed yet
    if (!localStorage.getItem('dblaq_subscribed')) {
      toggleNewsletterPopup(true);
    }
  }, 1500);
});

// ==========================================
// 1. ROUTER & NAVIGATION
// ==========================================
function navigateTo(viewId, params = null) {
  state.currentView = viewId;
  
  // Hide all sections and remove active class
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show selected section
  const activeSection = document.getElementById(`${viewId}-view`);
  if (activeSection) {
    activeSection.classList.add('active');
  }

  // Window scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Handle header color/opacity adjustments on non-home views
  const headerWrapper = document.getElementById('header-wrapper');
  if (viewId !== 'home') {
    headerWrapper.classList.add('scrolled');
    // Stop slider autoplay
    if (state.slideAutoplayTimer) {
      clearInterval(state.slideAutoplayTimer);
    }
  } else {
    // Re-check scroll position for home view
    if (window.scrollY <= 20) {
      headerWrapper.classList.remove('scrolled');
    }
    initSliderAutoplay();
  }

  // Route specific load logic
  if (viewId === 'catalog') {
    // Reset title
    document.getElementById('catalog-title').innerText = 
      state.catalogFilters.category === 'all' 
        ? 'Shop All' 
        : getCategoryDisplayName(state.catalogFilters.category);
    renderCatalogGrid();
    updateFilterCounts();
  } else if (viewId === 'product' && params && params.productId) {
    renderProductDetail(params.productId);
  } else if (viewId === 'checkout') {
    renderCheckoutSummary();
  }
}

// Translate filter names to display labels
function getCategoryDisplayName(cat) {
  switch (cat) {
    case 't-shirt': return 'T-Shirts';
    case 'shirts': return 'Shirts';
    case 'hoodies': return 'Hoodies';
    case 'joggers': return 'Joggers';
    case 'jeans': return 'Jeans';
    case 'polo-t-shirt': return 'Polo Shirts';
    case 'caps-and-hats': return 'Caps & Accessories';
    default: return 'Shop All';
  }
}

// Special shortcut filtering directly from homepage
function filterCatalog(category) {
  resetAllFilters();
  if (category === 'new') {
    state.catalogFilters.category = 'all';
    // Mocking new arrivals filtering by custom sorting or special flags
    state.catalogSort = 'default';
  } else if (category === 'sale') {
    state.catalogFilters.category = 'all';
    // We will show items that have originalPrice > price
    state.catalogSort = 'default';
  } else {
    state.catalogFilters.category = category;
  }
  navigateTo('catalog');
}

// ==========================================
// 2. HEADER SCROLL EFFECT
// ==========================================
function initHeaderScroll() {
  const headerWrapper = document.getElementById('header-wrapper');
  window.addEventListener('scroll', () => {
    if (state.currentView === 'home') {
      if (window.scrollY > 20) {
        headerWrapper.classList.add('scrolled');
      } else {
        headerWrapper.classList.remove('scrolled');
      }
    }
  });
}

// ==========================================
// 3. HERO SLIDER LOGIC
// ==========================================
function initSliderAutoplay() {
  if (state.slideAutoplayTimer) {
    clearInterval(state.slideAutoplayTimer);
  }
  state.slideAutoplayTimer = setInterval(() => {
    let nextIndex = (state.currentSlideIndex + 1) % 4;
    setSlide(nextIndex);
  }, 6000);
}

function setSlide(slideIndex) {
  state.currentSlideIndex = slideIndex;
  
  // Transition active classes for slide containers
  document.querySelectorAll('.hero-slider .slide').forEach((slide, idx) => {
    if (idx === slideIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  // Transition active dots
  document.querySelectorAll('.slider-dots .dot').forEach((dot, idx) => {
    if (idx === slideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Reset timer on manual selection
  initSliderAutoplay();
}

// ==========================================
// 4. AJAX SEARCH OVERLAY
// ==========================================
function toggleSearchOverlay(show) {
  const searchOverlay = document.getElementById('search-overlay');
  const inputField = document.getElementById('search-input-field');
  
  if (show) {
    searchOverlay.classList.add('active');
    inputField.value = '';
    inputField.focus();
    handleSearchQuery('');
  } else {
    searchOverlay.classList.remove('active');
  }
}

function handleSearchQuery(query) {
  const container = document.getElementById('search-results-container');
  
  if (!query.trim()) {
    container.innerHTML = `<p style="text-align: center; opacity: 0.5; font-size: 15px; margin-top: 40px;">Start typing to search streetwear apparel...</p>`;
    return;
  }

  const results = PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    container.innerHTML = `<p style="text-align: center; opacity: 0.5; font-size: 15px; margin-top: 40px;">No products found matching "${query}"</p>`;
    return;
  }

  container.innerHTML = results.map(product => `
    <div class="search-result-item" onclick="toggleSearchOverlay(false); navigateTo('product', {productId: '${product.id}'})">
      <img src="${product.images[0]}" class="search-result-img" alt="${product.title}">
      <div>
        <h4 class="search-result-title">${product.title}</h4>
        <p style="font-size: 12px; opacity: 0.6; text-transform: uppercase;">${product.subTitle}</p>
      </div>
      <span class="search-result-price">Rs. ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
    </div>
  `).join('');
}

// ==========================================
// 5. CATALOG VIEW & SIDEBAR FILTERS
// ==========================================
function initFilterSidebarColors() {
  const container = document.getElementById('filter-colors-container');
  
  // Extract all unique colors from product variations
  const uniqueColors = new Set();
  PRODUCTS.forEach(p => {
    if (p.variations && p.variations.colors) {
      p.variations.colors.forEach(c => uniqueColors.add(c));
    }
  });

  container.innerHTML = Array.from(uniqueColors).map(color => {
    // Map nice hex codes for the colors or use the color strings directly
    const hex = getColorHex(color);
    return `
      <div class="color-swatch-item" 
           title="${color}" 
           style="background-color: ${hex};" 
           data-color="${color}" 
           onclick="toggleColorFilter(this)">
      </div>
    `;
  }).join('');
}

function getColorHex(colorName) {
  const mapping = {
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
}

function toggleColorFilter(element) {
  const color = element.getAttribute('data-color');
  
  if (state.catalogFilters.color === color) {
    state.catalogFilters.color = 'all';
    element.classList.remove('active');
  } else {
    // Remove active from others
    document.querySelectorAll('.color-swatch-item').forEach(item => item.classList.remove('active'));
    state.catalogFilters.color = color;
    element.classList.add('active');
  }
  
  renderCatalogGrid();
}

function setCategoryFilter(category) {
  state.catalogFilters.category = category;
  
  // Update active status on buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`cat-filter-${category}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  document.getElementById('catalog-title').innerText = getCategoryDisplayName(category);
  renderCatalogGrid();
}

function handlePriceRangeChange(val) {
  state.catalogFilters.maxPrice = parseInt(val);
  document.getElementById('price-slider-val-label').innerText = `Rs. ${state.catalogFilters.maxPrice.toLocaleString()}`;
  renderCatalogGrid();
}

function resetAllFilters() {
  state.catalogFilters = {
    category: 'all',
    color: 'all',
    maxPrice: 8000,
    search: ''
  };
  
  // Reset UI elements
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('cat-filter-all').classList.add('active');
  
  document.querySelectorAll('.color-swatch-item').forEach(item => item.classList.remove('active'));
  
  const priceSlider = document.getElementById('price-slider');
  priceSlider.value = 8000;
  document.getElementById('price-slider-val-label').innerText = 'Rs. 8,000';
  
  renderCatalogGrid();
}

function updateFilterCounts() {
  // Update total counts for each category
  document.getElementById('count-all').innerText = `(${PRODUCTS.length})`;
  
  const counts = {
    't-shirt': 0,
    'shirts': 0,
    'hoodies': 0,
    'joggers': 0,
    'jeans': 0,
    'polo-t-shirt': 0,
    'caps-and-hats': 0
  };
  
  PRODUCTS.forEach(p => {
    if (counts[p.category] !== undefined) {
      counts[p.category]++;
    }
  });

  for (let key in counts) {
    const label = document.getElementById(`count-${key}`);
    if (label) label.innerText = `(${counts[key]})`;
  }
}

function handleCatalogSort() {
  state.catalogSort = document.getElementById('catalog-sort').value;
  renderCatalogGrid();
}

function changeCatalogGrid(columns) {
  const grid = document.getElementById('catalog-products-grid');
  grid.className = `products-grid columns-${columns}`;
  
  // Highlight selector button
  document.querySelectorAll('.layout-btn').forEach((btn, idx) => {
    // Indexes: 2cols is first (idx 0), 3cols is second (idx 1), 4cols is third (idx 2)
    if ((columns === 2 && idx === 0) || (columns === 3 && idx === 1) || (columns === 4 && idx === 2)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function toggleFilterDrawer(show) {
  const drawer = document.getElementById('filter-drawer');
  const backdrop = document.getElementById('panel-backdrop');
  
  if (show) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
  } else {
    drawer.classList.remove('active');
    if (!document.getElementById('cart-drawer').classList.contains('active')) {
      backdrop.classList.remove('active');
    }
  }
}

// Build list grid content
function renderCatalogGrid() {
  const container = document.getElementById('catalog-products-grid');
  
  // Filter product list
  let items = PRODUCTS.filter(p => {
    // 1. Category check
    if (state.catalogFilters.category !== 'all' && p.category !== state.catalogFilters.category) {
      return false;
    }
    
    // 2. Color check
    if (state.catalogFilters.color !== 'all' && !p.variations.colors.includes(state.catalogFilters.color)) {
      return false;
    }
    
    // 3. Price check
    if (p.price > state.catalogFilters.maxPrice) {
      return false;
    }
    
    return true;
  });

  // Sort items list
  if (state.catalogSort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (state.catalogSort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  } else if (state.catalogSort === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  }

  if (items.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 100px 0; opacity: 0.5;">No items found matching your filters.</p>`;
    return;
  }

  container.innerHTML = items.map(product => buildProductCardHtml(product)).join('');
}

// Helper to construct a single product card
function buildProductCardHtml(product) {
  // Badges block
  let badges = '';
  if (product.isNew) badges += `<span class="badge badge-new">New</span>`;
  if (product.isHot) badges += `<span class="badge badge-hot">Hot</span>`;
  if (product.originalPrice) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    badges += `<span class="badge badge-sale">-${discount}%</span>`;
  }

  // Image hover swap
  const img1 = product.images[0];
  const img2 = product.images[1] || product.images[0];

  // Pricing format
  const isSale = !!product.originalPrice;
  const priceHtml = isSale
    ? `<span class="product-price sale-price">Rs. ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
       <span class="product-old-price">Rs. ${product.originalPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>`
    : `<span class="product-price">Rs. ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>`;

  // Installment preview (Rs. price / 3)
  const installmentCost = Math.round(product.price / 3).toLocaleString();

  return `
    <div class="product-card">
      <div class="product-media" onclick="navigateTo('product', {productId: '${product.id}'})">
        <div class="product-badges">${badges}</div>
        <img src="${img1}" class="product-img" alt="${product.title}" loading="lazy">
        <img src="${img2}" class="product-img hover-img" alt="${product.title}" loading="lazy">
        <div class="product-actions-overlay">
          <button class="overlay-btn" onclick="event.stopPropagation(); navigateTo('product', {productId: '${product.id}'})">Quick View</button>
          <button class="overlay-btn" onclick="event.stopPropagation(); navigateTo('product', {productId: '${product.id}'})">Select Options</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-subtitle">${product.subTitle}</span>
        <h3 class="product-title"><a href="#" onclick="navigateTo('product', {productId: '${product.id}'})">${product.title}</a></h3>
        <div class="product-price-row">
          ${priceHtml}
        </div>
        <div class="bnpl-widget">
          <span>Or 3 x <strong style="color: var(--color-black);">Rs. ${installmentCost}</strong> with</span>
          <span class="bnpl-badge">Mintpay</span>
        </div>
      </div>
    </div>
  `;
}

// Popular Showcase homepage section
function renderFeaturedShowcase() {
  const container = document.getElementById('home-products-grid');
  // Grab up to 5 elements flagged isSpecial or isHot
  const featured = PRODUCTS.slice(0, 5);
  container.innerHTML = featured.map(product => buildProductCardHtml(product)).join('');
}

// ==========================================
// 6. SINGLE PRODUCT DETAIL LOGIC
// ==========================================
function renderProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Set detailed state
  state.detailState.product = product;
  state.detailState.selectedColor = null;
  state.detailState.selectedSize = null;
  state.detailState.quantity = 1;

  // Update Breadcrumb and Metadata
  document.getElementById('detail-breadcrumb-title').innerText = product.title;
  document.getElementById('product-detail-subtitle').innerText = product.subTitle;
  document.getElementById('product-detail-title').innerText = product.title;
  document.getElementById('product-detail-desc').innerText = product.description;

  // Render Prices
  const isSale = !!product.originalPrice;
  const priceLabel = document.getElementById('product-detail-price');
  const oldPriceLabel = document.getElementById('product-detail-old-price');
  
  priceLabel.innerText = `Rs. ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  if (isSale) {
    priceLabel.classList.add('sale-price');
    oldPriceLabel.innerText = `Rs. ${product.originalPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    oldPriceLabel.style.display = 'inline-block';
  } else {
    priceLabel.classList.remove('sale-price');
    oldPriceLabel.style.display = 'none';
  }

  // Installments calculation
  const inst3 = (product.price / 3).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const inst4 = (product.price / 4).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  document.getElementById('detail-bnpl-mintpay').innerText = `Rs. ${inst3} x 3`;
  document.getElementById('detail-bnpl-koko').innerText = `Rs. ${inst3} x 3`;
  document.getElementById('detail-bnpl-payzy').innerText = `Rs. ${inst4} x 4`;

  // Gallery
  const mainImg = document.getElementById('product-detail-main-img');
  mainImg.src = product.images[0];
  
  const thumbnailsContainer = document.getElementById('product-detail-thumbnails');
  thumbnailsContainer.innerHTML = product.images.map((img, idx) => `
    <img src="${img}" class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="swapDetailMainImage(this, '${img}')" alt="Thumb ${idx + 1}">
  `).join('');

  // Reset Quantity UI
  document.getElementById('detail-qty-value').innerText = '1';

  // Render Swatches
  renderDetailSwatches();
  validateSwatchesAvailability();
}

function swapDetailMainImage(thumbnailElement, src) {
  document.getElementById('product-detail-main-img').src = src;
  
  // Highlight correct thumbnail
  document.querySelectorAll('.gallery-thumbnails .thumb-item').forEach(thumb => {
    thumb.classList.remove('active');
  });
  thumbnailElement.classList.add('active');
}

function renderDetailSwatches() {
  const product = state.detailState.product;
  const colorContainer = document.getElementById('color-swatches-container');
  const sizeContainer = document.getElementById('size-swatches-container');

  // Load Colors swatches
  colorContainer.innerHTML = product.variations.colors.map(color => `
    <button class="swatch-btn" data-color="${color}" onclick="selectDetailColor('${color}')">${color}</button>
  `).join('');

  // Load Sizes swatches
  sizeContainer.innerHTML = product.variations.sizes.map(size => `
    <button class="swatch-btn" data-size="${size}" onclick="selectDetailSize('${size}')">${size}</button>
  `).join('');

  // Reset Label alerts
  document.getElementById('selected-color-label').innerText = 'Select Color';
  document.getElementById('selected-size-label').innerText = 'Select Size';
  document.getElementById('clear-swatches').style.display = 'none';
  document.getElementById('detail-stock-msg').style.display = 'none';
  document.getElementById('add-to-cart-cta').disabled = true;
}

function selectDetailColor(color) {
  state.detailState.selectedColor = color;
  document.getElementById('selected-color-label').innerText = color;
  
  // Highlight button
  document.querySelectorAll('#color-swatches-container .swatch-btn').forEach(btn => {
    if (btn.getAttribute('data-color') === color) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.getElementById('clear-swatches').style.display = 'inline-block';
  validateSwatchesAvailability();
}

function selectDetailSize(size) {
  state.detailState.selectedSize = size;
  document.getElementById('selected-size-label').innerText = size;
  
  // Highlight button
  document.querySelectorAll('#size-swatches-container .swatch-btn').forEach(btn => {
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.getElementById('clear-swatches').style.display = 'inline-block';
  validateSwatchesAvailability();
}

// CRITICAL VARIATION STOCKS VALIDATION RULES
function validateSwatchesAvailability() {
  const product = state.detailState.product;
  const selectedColor = state.detailState.selectedColor;
  const selectedSize = state.detailState.selectedSize;

  // 1. Check colors availability based on chosen size
  document.querySelectorAll('#color-swatches-container .swatch-btn').forEach(btn => {
    const color = btn.getAttribute('data-color');
    if (selectedSize) {
      const stock = product.variations.stock[`${color}_${selectedSize}`];
      if (stock === 0 || stock === undefined) {
        btn.classList.add('disabled');
      } else {
        btn.classList.remove('disabled');
      }
    } else {
      btn.classList.remove('disabled');
    }
  });

  // 2. Check sizes availability based on chosen color
  document.querySelectorAll('#size-swatches-container .swatch-btn').forEach(btn => {
    const size = btn.getAttribute('data-size');
    if (selectedColor) {
      const stock = product.variations.stock[`${selectedColor}_${size}`];
      if (stock === 0 || stock === undefined) {
        btn.classList.add('disabled');
      } else {
        btn.classList.remove('disabled');
      }
    } else {
      btn.classList.remove('disabled');
    }
  });

  // 3. Render stock details and enable add to cart if both selected
  const stockMsg = document.getElementById('detail-stock-msg');
  const cartCta = document.getElementById('add-to-cart-cta');

  if (selectedColor && selectedSize) {
    const key = `${selectedColor}_${selectedSize}`;
    const stock = product.variations.stock[key];

    if (stock > 0) {
      stockMsg.className = 'stock-status-msg in-stock';
      stockMsg.innerText = `${stock} in stock`;
      stockMsg.style.display = 'block';
      cartCta.disabled = false;
    } else {
      stockMsg.className = 'stock-status-msg out-of-stock';
      stockMsg.innerText = `Out of stock`;
      stockMsg.style.display = 'block';
      cartCta.disabled = true;
    }
  } else {
    stockMsg.style.display = 'none';
    cartCta.disabled = true;
  }
}

function clearDetailSwatches() {
  state.detailState.selectedColor = null;
  state.detailState.selectedSize = null;
  
  document.querySelectorAll('.swatch-options .swatch-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.remove('disabled');
  });

  document.getElementById('selected-color-label').innerText = 'Select Color';
  document.getElementById('selected-size-label').innerText = 'Select Size';
  document.getElementById('clear-swatches').style.display = 'none';
  document.getElementById('detail-stock-msg').style.display = 'none';
  document.getElementById('add-to-cart-cta').disabled = true;
}

function updateDetailQty(delta) {
  let val = parseInt(document.getElementById('detail-qty-value').innerText);
  val = Math.max(1, val + delta);
  document.getElementById('detail-qty-value').innerText = val;
  state.detailState.quantity = val;
}

function handleDetailAddToCart() {
  const p = state.detailState.product;
  const col = state.detailState.selectedColor;
  const sz = state.detailState.selectedSize;
  const qty = state.detailState.quantity;

  if (!col || !sz) return;

  // Add to cart state
  const existingIdx = state.cart.findIndex(item => 
    item.id === p.id && item.selectedColor === col && item.selectedSize === sz
  );

  if (existingIdx > -1) {
    state.cart[existingIdx].quantity += qty;
  } else {
    state.cart.push({
      id: p.id,
      title: p.title,
      price: p.price,
      selectedColor: col,
      selectedSize: sz,
      quantity: qty,
      image: p.images[0]
    });
  }

  // Update Cart badge count
  updateCartBadge();
  
  // Visual feedback on CTA
  const cta = document.getElementById('add-to-cart-cta');
  const oldText = cta.innerText;
  cta.innerText = "Adding...";
  cta.disabled = true;

  setTimeout(() => {
    cta.innerText = oldText;
    cta.disabled = false;
    // Open cart drawer
    renderCartDrawer();
    toggleCartDrawer(true);
  }, 800);
}

function copyDetailUrl() {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);
  dummy.value = window.location.href + `?product=${state.detailState.product.id}`;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  alert('Product URL copied to clipboard!');
}

function toggleAccordion(element) {
  const item = element;
  const isActive = item.classList.contains('active');
  
  document.querySelectorAll('.accordion-item').forEach(node => {
    node.classList.remove('active');
  });

  if (!isActive) {
    item.classList.add('active');
  }
}

// ==========================================
// 7. CART DRAWER (SHOPPING BAG)
// ==========================================
function toggleCartDrawer(show) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('panel-backdrop');
  
  if (show) {
    renderCartDrawer();
    drawer.classList.add('active');
    backdrop.classList.add('active');
  } else {
    drawer.classList.remove('active');
    if (!document.getElementById('filter-drawer').classList.contains('active')) {
      backdrop.classList.remove('active');
    }
  }
}

function updateCartBadge() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count-badge').innerText = count;
  document.getElementById('cart-count-title').innerText = count;
}

function renderCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  const couponBox = document.getElementById('mini-coupon-drawer');
  
  updateCartBadge();

  if (state.cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <p>Your shopping bag is empty.</p>
        <button class="btn-primary" style="margin-top:20px; font-size:11px;" onclick="toggleCartDrawer(false); navigateTo('catalog')">Start Shopping</button>
      </div>
    `;
    footer.style.display = 'none';
    couponBox.style.display = 'none';
    return;
  }

  // Render Items
  body.innerHTML = `
    <div class="cart-items-list">
      ${state.cart.map((item, idx) => `
        <div class="cart-item">
          <img src="${item.image}" class="cart-item-img" alt="${item.title}">
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-title">${item.title}</h4>
              <p class="cart-item-meta">Color: ${item.selectedColor} | Size: ${item.selectedSize}</p>
            </div>
            
            <div class="cart-item-quantity-row">
              <div class="qty-spinner">
                <button class="qty-btn" onclick="updateCartItemQty(${idx}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateCartItemQty(${idx}, 1)">+</button>
              </div>
              <span class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${idx})">✕</button>
        </div>
      `).join('')}
    </div>
  `;

  // Calculations
  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  document.getElementById('cart-subtotal').innerText = `Rs. ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

  // Coupon calculations
  const discountRow = document.getElementById('cart-discount-row');
  if (state.appliedCoupon) {
    const discountVal = subtotal * state.appliedCoupon.rate;
    document.getElementById('cart-discount-code-label').innerText = state.appliedCoupon.code;
    document.getElementById('cart-discount-val').innerText = `-Rs. ${discountVal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    discountRow.style.display = 'flex';
  } else {
    discountRow.style.display = 'none';
  }

  footer.style.display = 'flex';
  couponBox.style.display = 'block';
}

function updateCartItemQty(index, delta) {
  state.cart[index].quantity += delta;
  
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }
  
  renderCartDrawer();
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  renderCartDrawer();
}

function toggleCouponInput() {
  const content = document.getElementById('coupon-content');
  const arrow = document.getElementById('coupon-toggle-arrow');
  const toggle = document.getElementById('coupon-toggle');
  
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    arrow.innerText = '▼';
    toggle.classList.remove('expanded');
  } else {
    content.classList.add('active');
    arrow.innerText = '▲';
    toggle.classList.add('expanded');
  }
}

function applyCartCoupon() {
  const input = document.getElementById('cart-coupon-input');
  const code = input.value.trim().toUpperCase();
  const msg = document.getElementById('cart-coupon-msg');
  
  msg.style.display = 'block';

  if (!code) {
    msg.className = "coupon-msg error";
    msg.innerText = "Please enter a coupon code.";
    return;
  }

  if (COUPONS[code]) {
    state.appliedCoupon = {
      code: code,
      rate: COUPONS[code]
    };
    msg.className = "coupon-msg success";
    msg.innerText = `Coupon "${code}" applied successfully! You got ${COUPONS[code]*100}% off.`;
    renderCartDrawer();
  } else {
    msg.className = "coupon-msg error";
    msg.innerText = "Invalid coupon code.";
  }
}

// ==========================================
// 8. CHECKOUT PAGE FLOW
// ==========================================
function navigateToCheckout() {
  toggleCartDrawer(false);
  navigateTo('checkout');
}

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById('checkout-summary-items');
  
  if (state.cart.length === 0) {
    summaryContainer.innerHTML = `<p style="opacity: 0.5;">No items in cart.</p>`;
    return;
  }

  summaryContainer.innerHTML = state.cart.map(item => `
    <div class="summary-item-card">
      <img src="${item.image}" class="summary-item-img" alt="${item.title}">
      <div class="summary-item-info">
        <h4 class="summary-item-title">${item.title}</h4>
        <p class="summary-item-meta">Color: ${item.selectedColor} | Size: ${item.selectedSize} | Qty: ${item.quantity}</p>
      </div>
      <span class="summary-item-price">Rs. ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
    </div>
  `).join('');

  // Calculations
  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  document.getElementById('checkout-subtotal').innerText = `Rs. ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

  let total = subtotal;
  
  // Coupon
  const discountRow = document.getElementById('checkout-discount-row');
  if (state.appliedCoupon) {
    const discountVal = subtotal * state.appliedCoupon.rate;
    total -= discountVal;
    document.getElementById('checkout-discount-code').innerText = state.appliedCoupon.code;
    document.getElementById('checkout-discount-val').innerText = `-Rs. ${discountVal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    discountRow.style.display = 'flex';
  } else {
    discountRow.style.display = 'none';
  }

  // Shipping
  const shipping = 400;
  total += shipping;

  document.getElementById('checkout-total').innerText = `Rs. ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

function selectPaymentMethod(method) {
  state.checkoutPaymentMethod = method;
  
  // Highlight payment options
  document.querySelectorAll('.payment-option').forEach(option => {
    option.classList.remove('active');
  });

  const payOptions = {
    'cod': 'pay-cod',
    'mintpay': 'pay-mintpay',
    'koko': 'pay-koko',
    'webxpay': 'pay-webxpay'
  };

  // Check radio buttons
  document.getElementById(payOptions[method]).checked = true;
  
  // Add active style to container
  document.getElementById(payOptions[method]).closest('.payment-option').classList.add('active');
}

function processOrderPlacement(event) {
  event.preventDefault();

  // Create random order reference
  const randomRef = `#DB-${Math.floor(10000 + Math.random() * 90000)}`;
  const methodLabel = {
    'cod': 'Cash On Delivery (COD)',
    'mintpay': 'Mintpay Installments',
    'koko': 'Koko BNPL',
    'webxpay': 'Credit / Debit Card (WebXPay)'
  };

  const totalLabel = document.getElementById('checkout-total').innerText;

  // Set confirmation views variables
  document.getElementById('confirm-ref').innerText = randomRef;
  document.getElementById('confirm-date').innerText = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('confirm-payment').innerText = methodLabel[state.checkoutPaymentMethod];
  document.getElementById('confirm-total').innerText = totalLabel;

  // Clear Cart
  state.cart = [];
  state.appliedCoupon = null;
  updateCartBadge();

  // Transition to confirmation view
  navigateTo('confirmation');
}

// ==========================================
// 9. POPUPS & ALERTS
// ==========================================
function toggleNewsletterPopup(show) {
  const modal = document.getElementById('newsletter-popup');
  const backdrop = document.getElementById('newsletter-popup-backdrop');
  
  if (show) {
    modal.classList.add('active');
    backdrop.classList.add('active');
  } else {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
  }
}

function handlePopupSubmit(event) {
  event.preventDefault();
  localStorage.setItem('dblaq_subscribed', 'true');
  
  // Reveal coupon code
  alert("Subscription Successful! Enter Coupon Code 'BLAQ10' inside your bag drawer for 10% off your purchase.");
  toggleNewsletterPopup(false);
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  alert("Thank you for subscribing! Check your email inbox for style drops soon.");
  event.target.reset();
}

function showAccountAlert() {
  alert("D-BLAQ Accounts portal is temporarily undergoing regular system maintenance. Guest checkout remains fully operational!");
}

function showGiftCardAlert() {
  alert("Electronic Gift Card certificates will launch on our store soon! Stay tuned.");
}

function showTermsAlert(sectionName) {
  alert(`You clicked the footer link for "${sectionName}". The detailed terms and conditions document is linked on the standard D-Blaq policy logs.`);
}
