/**
 * Product Migration Script
 * 
 * Run this script to migrate all hardcoded products to Supabase database.
 * Usage: npx tsx scripts/migrate-products.ts
 * 
 * Make sure you have the following environment variables set:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Products to migrate (from src/data/products.ts)
const products = [
    {
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
        review_count: 124,
    },
    {
        title: "Cambridge Cable-Knit",
        price: 2999,
        original_price: 4500,
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
        review_count: 89,
    },
    {
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
        review_count: 56,
    },
    {
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
        review_count: 32,
    },
    {
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
        review_count: 15,
    },
    {
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
        review_count: 42,
    },
    {
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
        review_count: 28,
    },
    {
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
        review_count: 38,
    },
];

async function migrateProducts() {
    // Load environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("❌ Missing Supabase environment variables!");
        console.error("Please ensure the following are set in .env.local:");
        console.error("  - NEXT_PUBLIC_SUPABASE_URL");
        console.error("  - SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard → Settings → API)");
        process.exit(1);
    }

    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🚀 Starting product migration...\n");

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const product of products) {
        // Check if product already exists by handle
        const { data: existing } = await supabase
            .from("products")
            .select("id")
            .eq("handle", product.handle)
            .single();

        if (existing) {
            console.log(`⏭️  Skipped: "${product.title}" (already exists)`);
            skipCount++;
            continue;
        }

        // Insert new product
        const { error } = await supabase
            .from("products")
            .insert(product);

        if (error) {
            console.error(`❌ Error inserting "${product.title}":`, error.message);
            errorCount++;
        } else {
            console.log(`✅ Migrated: "${product.title}"`);
            successCount++;
        }
    }

    console.log("\n📊 Migration Summary:");
    console.log(`   ✅ Created: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors:  ${errorCount}`);
    console.log("\n🎉 Migration complete!");
}

migrateProducts().catch(console.error);
