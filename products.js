const PRODUCTS = [
  {
    id: "aop-oversized-tee",
    title: "D-blaq AOP Oversized T-Shirt",
    price: 3200,
    originalPrice: 4500,
    category: "t-shirt",
    isNew: true,
    isHot: true,
    isSpecial: true,
    subTitle: "BUBBLE KNIT",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    description: "An signature all-over print oversized t-shirt designed for comfort and a bold street-style statement. Crafted from heavy-weight 240GSM combed cotton, it features a ribbed crewneck collar, relaxed shoulders, and high-density printing that stands up to daily wear.",
    variations: {
      colors: ["Black", "Navy", "Beige"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: {
        "Black_S": 5, "Black_M": 3, "Black_L": 0, "Black_XL": 2, "Black_XXL": 1,
        "Navy_S": 0, "Navy_M": 4, "Navy_L": 6, "Navy_XL": 0, "Navy_XXL": 2,
        "Beige_S": 2, "Beige_M": 0, "Beige_L": 5, "Beige_XL": 4, "Beige_XXL": 0
      }
    }
  },
  {
    id: "lux-soft-long-sleeve",
    title: "Lux Soft M Stripe Long Sleeve Shirt",
    price: 4900,
    originalPrice: null,
    category: "shirts",
    isNew: true,
    isHot: false,
    isSpecial: false,
    subTitle: "FORMAL & CASUAL",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Upgrade your wardrobe with this luxury stripe button-down shirt. Features a soft-brushed cotton fabric finish that feels light against the skin. Cut in a modern regular fit, it transitions seamlessly from daytime business to late-evening lounge contexts.",
    variations: {
      colors: ["White/Blue", "Grey/Black"],
      sizes: ["M", "L", "XL", "XXL"],
      stock: {
        "White/Blue_M": 2, "White/Blue_L": 5, "White/Blue_XL": 3, "White/Blue_XXL": 0,
        "Grey/Black_M": 4, "Grey/Black_L": 0, "Grey/Black_XL": 5, "Grey/Black_XXL": 3
      }
    }
  },
  {
    id: "lone-wolf-tee",
    title: "The Lone Wolf Oversized T-Shirt",
    price: 2950,
    originalPrice: 3800,
    category: "t-shirt",
    isNew: false,
    isHot: true,
    isSpecial: true,
    subTitle: "OVERSIZED FIT",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Designed for the modern rebel, The Lone Wolf Tee features a high-density vintage washed graphic print on the front. Relaxed drop shoulders, wide sleeves, and a structured fit give you that effortless street silhouette.",
    variations: {
      colors: ["Vintage Wash", "Charcoal"],
      sizes: ["S", "M", "L", "XL"],
      stock: {
        "Vintage Wash_S": 3, "Vintage Wash_M": 6, "Vintage Wash_L": 2, "Vintage Wash_XL": 0,
        "Charcoal_S": 0, "Charcoal_M": 2, "Charcoal_L": 4, "Charcoal_XL": 1
      }
    }
  },
  {
    id: "raised-stripe-long-sleeve",
    title: "Raised Stripe Long Sleeve Shirt",
    price: 4500,
    originalPrice: 5500,
    category: "shirts",
    isNew: true,
    isHot: false,
    isSpecial: true,
    subTitle: "PREMIUM STRIPES",
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A textured stripe design that offers a distinct premium look. Made from a heavy organic cotton blend, it is structured yet incredibly soft. Features an elegant hidden placket and adjustable button cuffs.",
    variations: {
      colors: ["Navy Stripe", "Beige Stripe"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: {
        "Navy Stripe_S": 2, "Navy Stripe_M": 5, "Navy Stripe_L": 4, "Navy Stripe_XL": 0, "Navy Stripe_XXL": 2,
        "Beige Stripe_S": 0, "Beige Stripe_M": 3, "Beige Stripe_L": 1, "Beige Stripe_XL": 3, "Beige Stripe_XXL": 0
      }
    }
  },
  {
    id: "urbaneagle-st-art-hoodie",
    title: "Urbaneagle St.Art Hoodie",
    price: 6800,
    originalPrice: null,
    category: "hoodies",
    isNew: true,
    isHot: true,
    isSpecial: false,
    subTitle: "STREET CULTURE",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A premium heavy-fleece hoodie with a brushed inner lining for extra warmth and coziness. Designed with custom screen-printed artwork across the back, a double-lined hood, and a generous kangaroo pocket.",
    variations: {
      colors: ["Off-White", "Sage Green"],
      sizes: ["S", "M", "L", "XL"],
      stock: {
        "Off-White_S": 3, "Off-White_M": 4, "Off-White_L": 2, "Off-White_XL": 1,
        "Sage Green_S": 2, "Sage Green_M": 0, "Sage Green_L": 5, "Sage Green_XL": 0
      }
    }
  },
  {
    id: "amazon-bloom-tee",
    title: "Amazon Bloom T-Shirt",
    price: 3100,
    originalPrice: 4200,
    category: "t-shirt",
    isNew: false,
    isHot: false,
    isSpecial: true,
    subTitle: "FLORAL PRINTED",
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A clean minimalist shirt with a subtle floral back print inspired by tropical botany. Features a comfortable ribbed crewneck and custom stitching along the hem.",
    variations: {
      colors: ["White", "Charcoal"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: {
        "White_S": 4, "White_M": 5, "White_L": 3, "White_XL": 2, "White_XXL": 1,
        "Charcoal_S": 2, "Charcoal_M": 0, "Charcoal_L": 4, "Charcoal_XL": 0, "Charcoal_XXL": 0
      }
    }
  },
  {
    id: "streetwear-cargo-joggers",
    title: "Streetwear Flex Cargo Joggers",
    price: 5400,
    originalPrice: 7200,
    category: "joggers",
    isNew: false,
    isHot: true,
    isSpecial: true,
    subTitle: "FLEX IN COMFORT",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Designed with multi-pocket cargo utility, these joggers are crafted from durable ripstop cotton with an elastic waistband and drawstring ankles for an adjustable fit.",
    variations: {
      colors: ["Olive", "Black"],
      sizes: ["30", "32", "34", "36"],
      stock: {
        "Olive_30": 3, "Olive_32": 5, "Olive_34": 0, "Olive_36": 2,
        "Black_30": 4, "Black_32": 2, "Black_34": 3, "Black_36": 0
      }
    }
  },
  {
    id: "everyday-edge-jeans",
    title: "Everyday Edge Slim Jeans",
    price: 6200,
    originalPrice: null,
    category: "jeans",
    isNew: true,
    isHot: false,
    isSpecial: false,
    subTitle: "YOUR EVERYDAY EDGE",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Premium washed raw denim with light distressing details. Designed in a tapered slim fit that conforms to your form while offering just enough stretch for daily comfort.",
    variations: {
      colors: ["Indigo Wash", "Jet Black"],
      sizes: ["30", "32", "34", "36"],
      stock: {
        "Indigo Wash_30": 2, "Indigo Wash_32": 4, "Indigo Wash_34": 3, "Indigo Wash_36": 1,
        "Jet Black_30": 0, "Jet Black_32": 5, "Jet Black_34": 0, "Jet Black_36": 2
      }
    }
  },
  {
    id: "classic-fitted-polo",
    title: "D-blaq Classic Fitted Polo",
    price: 3600,
    originalPrice: 4200,
    category: "polo-t-shirt",
    isNew: true,
    isHot: false,
    isSpecial: true,
    subTitle: "NEW IN",
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A tailored pique cotton polo shirt featuring signature D-blaq embroidery on the chest. Designed with ribbed collar and cuffs, and a two-button placket for a smart-casual look.",
    variations: {
      colors: ["White", "Navy", "Dark Green"],
      sizes: ["S", "M", "L", "XL"],
      stock: {
        "White_S": 5, "White_M": 4, "White_L": 3, "White_XL": 1,
        "Navy_S": 2, "Navy_M": 3, "Navy_L": 0, "Navy_XL": 2,
        "Dark Green_S": 0, "Dark Green_M": 5, "Dark Green_L": 4, "Dark Green_XL": 0
      }
    }
  },
  {
    id: "signature-street-cap",
    title: "Signature Streetwear Cap",
    price: 1950,
    originalPrice: null,
    category: "caps-and-hats",
    isNew: true,
    isHot: false,
    isSpecial: false,
    subTitle: "ACCESSORIES",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic 6-panel unstructured baseball cap with flat-embellished branding. Designed with an adjustable fabric strap and brass buckle for a clean, universal fit.",
    variations: {
      colors: ["Black", "Khaki"],
      sizes: ["One Size"],
      stock: {
        "Black_One Size": 10,
        "Khaki_One Size": 8
      }
    }
  }
];
