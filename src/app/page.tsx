import { TopBar } from "@/components/store/TopBar";
import { HeroBanner } from "@/components/store/HeroBanner";
import { CosmeticaGrid } from "@/components/store/CosmeticaGrid";
import { MayoristaCTA } from "@/components/store/MayoristaCTA";
import { Testimonials } from "@/components/store/Testimonials";
import { ContactForm } from "@/components/store/ContactForm";
import { CartDrawer } from "@/components/store/CartDrawer";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { SearchModal } from "@/components/store/SearchModal";

export default function Home() {
  return (
    <>
      <TopBar />
      <HeroBanner />
      <CosmeticaGrid />
      <MayoristaCTA />
      <Testimonials />
      <ContactForm />
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
    </>
  );
}
