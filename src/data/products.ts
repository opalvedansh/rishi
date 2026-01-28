export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    handle: string;
    tag?: string;
    description?: string;
    images?: string[];
    sizes?: string[];
    colors?: string[];
    details?: string[];
    category?: string;
    rating?: number;
    reviewCount?: number;
}

export const products: Product[] = [
    {
        id: "1",
        title: "The Oxford Heritage Knit",
        price: 3499,
        image: "/assets/IMG_2355.PNG",
        handle: "oxford-heritage-knit",
        tag: "New",
        category: "Knitwear",
        description: "A classic reborn. The Oxford Heritage Knit combines traditional craftsmanship with modern comfort. Made from 100% premium wool, it features a timeless textured weave that provides potential warmth without the bulk. Perfect for layering over a crisp shirt.",
        images: ["/assets/IMG_2355.PNG", "/assets/IMG_2355.PNG", "/assets/IMG_2355.PNG"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Grey", "Cream"],
        details: ["100% Premium Wool", "Textured Weave", "Regular Fit", "Hand Wash Only"],
        rating: 4.8,
        reviewCount: 124,
    },
    {
        id: "2",
        title: "Cambridge Cable-Knit",
        price: 2999,
        originalPrice: 4500,
        image: "/assets/IMG_2204.PNG",
        handle: "cambridge-cable-knit",
        tag: "Sale",
        category: "Knitwear",
        description: "The Cambridge Cable-Knit is a testament to timeless style. Crafted from a luxurious blend of wool and cashmere, it offers unparalleled softness and warmth. The intricate cable pattern adds texture and depth, making it a versatile piece for both casual and formal occasions.",
        images: ["/assets/IMG_2204.PNG", "/assets/IMG_2204.PNG", "/assets/IMG_2204.PNG"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Beige", "Brown"],
        details: ["Premium Wool & Cashmere Blend", "Ribbed cuffs and hem", "Relaxed fit", "Dry clean only"],
        rating: 4.9,
        reviewCount: 89,
    },
    {
        id: "3",
        title: "Lucas Cotton Sweater",
        price: 3200,
        image: "/assets/IMG_2354.PNG",
        handle: "lucas-cotton-sweater",
        category: "Knitwear",
        description: "Lightweight, breathable, and effortlessly stylish. The Lucas Cotton Sweater is designed for transitional weather. Featuring a fine gauge knit and a soft hand feel, it's an essential staple for any wardrobe.",
        images: ["/assets/IMG_2354.PNG", "/assets/IMG_2354.PNG"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Charcoal"],
        details: ["100% Organic Cotton", "Fine Gauge Knit", "Crew Neck", "Machine Washable"],
        rating: 4.7,
        reviewCount: 56,
    },
    {
        id: "4",
        title: "Alcott Fine-Gauge Crewneck",
        price: 2800,
        image: "/assets/IMG_2369.PNG",
        handle: "alcott-fine-gauge",
        category: "Knitwear",
        description: "Simplicity at its finest. The Alcott Crewneck offers a sleek silhouette with its fine-gauge construction. Ideal for wearing under blazers or on its own for a sharp, minimalist look.",
        images: ["/assets/IMG_2369.PNG", "/assets/IMG_2369.PNG"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Black", "Grey"],
        details: ["Merino Wool Blend", "Slim Fit", "Ribbed Trims", "Dry Clean Recommended"],
        rating: 4.6,
        reviewCount: 32,
    },
    {
        id: "5",
        title: "Merino Wool Turtle Neck",
        price: 4200,
        image: "/assets/IMG_2363.PNG",
        handle: "merino-turtle-neck",
        category: "Knitwear",
        description: "Elevate your winter style with our Merino Wool Turtle Neck. Exceptionally soft and warm, this piece offers a sophisticated look that pairs perfectly with tailored trousers or denim.",
        images: ["/assets/IMG_2363.PNG", "/assets/IMG_2363.PNG"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Cream", "Black"],
        details: ["100% Merino Wool", "Roll Neck", "Regular Fit", "Hand Wash Cold"],
        rating: 5.0,
        reviewCount: 15,
    },
    {
        id: "6",
        title: "Classic Pleated Trousers",
        price: 3800,
        image: "/assets/IMG_2258.PNG",
        handle: "classic-pleated-trousers",
        category: "Trousers",
        description: "Tailored for the modern gentleman. These Classic Pleated Trousers feature a high waist and a single pleat for a comfortable yet refined fit. Cut from a premium wool blend fabric.",
        images: ["/assets/IMG_2258.PNG", "/assets/IMG_2258.PNG"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Grey", "Navy", "Khaki"],
        details: ["Wool Blend", "Single Pleat", "Tapered Leg", "Dry Clean Only"],
        rating: 4.8,
        reviewCount: 42,
    },
    {
        id: "7",
        title: "Tailored Linen Shirt",
        price: 2500,
        image: "/assets/IMG_2256.PNG",
        handle: "tailored-linen-shirt",
        category: "Shirts",
        description: "Breezy and sophisticated. Our Tailored Linen Shirt is crafted from the finest European linen, offering breathable comfort for warmer days. Finished with mother-of-pearl buttons.",
        images: ["/assets/IMG_2256.PNG", "/assets/IMG_2256.PNG"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Blue", "Beige"],
        details: ["100% Linen", "Tailored Fit", "Button-down Collar", "Machine Wash Cold"],
        rating: 4.5,
        reviewCount: 28,
    },
    {
        id: "8",
        title: "Textured Knit Polo",
        price: 3100,
        image: "/assets/IMG_2366.PNG",
        handle: "textured-knit-polo",
        category: "Accessories",
        description: "A retro-inspired classic. This Textured Knit Polo features a unique open weave pattern and a vintage style collar. It brings texture and character to any outfit.",
        images: ["/assets/IMG_2366.PNG", "/assets/IMG_2366.PNG"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Brown", "Cream"],
        details: ["Cotton Blend", "Open Weave Texture", "Polo Collar", "Hand Wash"],
        rating: 4.7,
        reviewCount: 38,
    },
];
