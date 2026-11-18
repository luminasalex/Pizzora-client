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
}

export default function HomePage({
  selectedCategory,
  searchQuery,
}: HomePageProps) {
  return (
    <main>
      <HeroSection />
      <FeaturedMenuSection
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
      <CategoriesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <VendorSection />
      <FinalCtaSection />
    </main>
  )
}
