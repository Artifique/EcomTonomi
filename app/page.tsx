import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromotionalBanners } from "@/components/promotional-banners"
import { CategoriesSection } from "@/components/categories-section"
import { PopularProducts } from "@/components/popular-products"
import { PromoSection } from "@/components/promo-section"
import { CustomerReviews } from "@/components/customer-reviews"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <PromotionalBanners />
        <CategoriesSection />
        <PopularProducts />
        <PromoSection />
        <CustomerReviews />
      </main>
      <Footer />
    </div>
  )
}
