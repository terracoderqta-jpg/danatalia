import { TopBar } from "@/components/store/TopBar";
import { HeroBanner } from "@/components/store/HeroBanner";
import { CosmeticaGrid } from "@/components/store/CosmeticaGrid";
import { MayoristaCTA } from "@/components/store/MayoristaCTA";
import { Testimonials } from "@/components/store/Testimonials";
import { ContactForm } from "@/components/store/ContactForm";
import { CartDrawer } from "@/components/store/CartDrawer";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { SearchModal } from "@/components/store/SearchModal";
import { SectionBanner } from "@/components/store/SectionBanner";
import { getBannersForPosition } from "@/lib/banners";

export default function Home() {
  const bannersInicio = getBannersForPosition("inicio");
  const bannersDespuesCategorias = getBannersForPosition("despues-categorias");
  const bannersDespuesProductos = getBannersForPosition("despues-productos");
  const bannersAntesContacto = getBannersForPosition("antes-contacto");

  return (
    <>
      <TopBar />
      <HeroBanner />
      {bannersInicio.map((b) => <SectionBanner key={b.slug} banner={b} />)}
      <CosmeticaGrid />
      {bannersDespuesCategorias.map((b) => <SectionBanner key={b.slug} banner={b} />)}
      <MayoristaCTA />
      {bannersDespuesProductos.map((b) => <SectionBanner key={b.slug} banner={b} />)}
      <Testimonials />
      {bannersAntesContacto.map((b) => <SectionBanner key={b.slug} banner={b} />)}
      <ContactForm />
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
    </>
  );
}
