import BenefitsSection from "./benefits-section"
import CategoriesSection from "./categories-section"
import FeaturedMenuSection from "./featured-menu-section"
import FinalCtaSection from "./final-cta-section"
import HeroSection from "./hero-section"
import HowItWorksSection from "./how-it-works-section"
import VendorSection from "./vendor-section"

type HomePageProps = {
  selectedCategory?: string
  searchQuery?: string
  featuredItems?: any[]
  categories?: any[]
}

export default function HomePage({
  selectedCategory,
  searchQuery,
  featuredItems,
  categories,
}: HomePageProps) {
  return (
    <main>
      <HeroSection />
      <FeaturedMenuSection
        items={featuredItems}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
      {categories && categories.length > 0 && (
        <CategoriesSection
          categories={categories}
          selectedCategory={selectedCategory}
        />
      )}
      <BenefitsSection />
      <HowItWorksSection />
      <VendorSection />
      <FinalCtaSection />
    </main>
  )
}