import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductDetailContent from "@/components/products/ProductDetailContent";

interface PageProps {
    params: Promise<{
        handle: string;
    }>;
}

export default async function ProductDetailPage(props: PageProps) {
    const params = await props.params;
    const product = products.find((p) => p.handle === params.handle);

    if (!product) {
        notFound();
    }

    // Filter related products (exclude current)
    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

    return <ProductDetailContent product={product} relatedProducts={relatedProducts} />;
}
