import Hero from "@/components/sections/Hero";
import CollectionGrid from "@/components/sections/CollectionGrid";
import ProductTabs from "@/components/sections/ProductTabs";
import FeaturedPromotion from "@/components/sections/FeaturedPromotion";

export default function Home() {
  return (
    <>
      <Hero />
      <CollectionGrid />
      <ProductTabs />
      <FeaturedPromotion />
    </>
  );
}
