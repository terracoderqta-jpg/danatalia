import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
          Error 404
        </p>
        <h1 className="heading-serif text-5xl md:text-6xl mb-4">404</h1>
        <p className="text-foreground/60 mb-8 max-w-md">
          La página que buscás no existe o fue movida. Pero tranquila, tenemos
          mucho más para mostrarte.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Volver al Inicio
          </Link>
          <Link href="/#cosmetica" className="btn-outline">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
