import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProductDetailContent from "@/components/products/ProductDetailContent";
import { products as staticProducts } from "@/data/products";

interface PageProps {
    params: Promise<{
        handle: string;
    }>;
}

export default async function ProductDetailPage(props: PageProps) {
    const params = await props.params;
    const supabase = await createClient();

    // Try to fetch from database first
    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("handle", params.handle)
        .single();

    // Fallback to static data if not found in database
    let finalProduct = product;
    let relatedProducts: any[] = [];

    if (!product || error) {
        // Try static products
        const staticProduct = staticProducts.find((p) => p.handle === params.handle);
        if (!staticProduct) {
            notFound();
        }

        // Convert static product format to database format
        finalProduct = {
            ...staticProduct,
            original_price: staticProduct.originalPrice,
            review_count: staticProduct.reviewCount,
        };

        // Related products from static data
        relatedProducts = staticProducts
            .filter(p => p.id !== staticProduct.id)
            .slice(0, 4)
            .map(p => ({
                ...p,
                original_price: p.originalPrice,
                review_count: p.reviewCount,
            }));
    } else {
        // Fetch related products from database
        const { data: related } = await supabase
            .from("products")
            .select("*")
            .neq("id", product.id)
            .limit(4);

        relatedProducts = related || [];
    }

    return <ProductDetailContent product={finalProduct} relatedProducts={relatedProducts} />;
}
