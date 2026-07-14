import Image from "next/image";

export function BrandSection() {
  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Dana Talía"
              width={600}
              height={600}
              className="w-full max-w-[420px] h-auto"
              unoptimized
              priority
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
              La Marca
            </p>
            <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Dana Talía
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                Nacida en Reconquista, Santa Fe, Dana Talía Núñez es modelo e
                influencer con una visión clara: crear lencería y trajes de baño
                que hagan sentir poderosa a cada mujer.
              </p>
              <p>
                Cada pieza de nuestra colección es diseñada con atención al
                detalle, utilizando telas premium y cortes que realzan la
                silueta. Desde conjuntos de encaje fino hasta bikinis de autor,
                cada creación cuenta una historia de sensualidad y elegancia.
              </p>
              <p>
                <em>&quot;La lencería no es solo una prenda, es una forma de expresar
                quién sos.&quot;</em>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/danatalia.lenceria"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Seguinos en Instagram
              </a>
              <a
                href="https://wa.me/5493482555555"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
