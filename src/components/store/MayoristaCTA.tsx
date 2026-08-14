"use client";

export function MayoristaCTA() {
  const benefits = [
    {
      icon: "🌿",
      title: "Productos Cruelty Free",
      desc: "Fórmulas botánicas que tus clientas van a amar. Calidad que se vende sola.",
    },
    {
      icon: "💰",
      title: "Margen hasta 42%",
      desc: "Descuentos mayoristas de hasta 42%. Tu ganancia es nuestra prioridad.",
    },
    {
      icon: "📚",
      title: "Capacitación Incluida",
      desc: "Te enseñamos a vender, crear contenido y crecer tu negocio desde cero.",
    },
    {
      icon: "🚚",
      title: "Envío Directo",
      desc: "Despachamos a tus clientas directamente. Vos solo cobrás y vendés.",
    },
  ];

  return (
    <section id="mayorista" className="section-padding bg-gradient-to-br from-piedra via-charcoal to-piedra text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-dorado/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-terracota/5 rounded-full blur-3xl" />

      <div className="container-site mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="heading-serif text-2xl md:text-3xl">
              ¿Querés trabajar con nosotros?
            </h3>
            <p className="text-white/50 max-w-md">
              Sumate a nuestra red de revendedoras mayoristas y empezá a vender
              productos que tus clientas van a amar.
            </p>
            <a
              href="https://wa.me/5493482312433?text=Hola!%20Me%20interesa%20ser%20revendedora%20mayorista"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dorado mt-4 w-fit"
            >
              Quiero Ser Revendedora
            </a>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-sm text-white/50">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
