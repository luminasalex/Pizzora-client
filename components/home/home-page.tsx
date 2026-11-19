import BenefitsSection from "./benefits-section"
import CategoriesSection from "./categories-section"
import FeaturedMenuSection from "./featured-menu-section"
import FinalCtaSection from "./final-cta-section"
import HeroSection from "./hero-section"
import HowItWorksSection from "./how-it-works-section"
import VendorSection from "./vendor-section"
import type { MenuItem } from "./menu-item-card"

type HomePageProps = {
  selectedCategory?: string
  searchQuery?: string
  featuredItems?: MenuItem[]
  error?: string
}

export default function HomePage({
  selectedCategory,
  searchQuery,
  featuredItems,
  error,
}: HomePageProps) {
  return (
    <main>
      <HeroSection />
      <FeaturedMenuSection
        items={featuredItems}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        error={error}
      />
      <CategoriesSection selectedCategory={selectedCategory} />
      <BenefitsSection />
      <HowItWorksSection />
      <VendorSection />
      <FinalCtaSection />
    </main>
  )
}