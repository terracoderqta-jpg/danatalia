export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-rose/20 border-t-rose rounded-full animate-spin" />
        <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">
          Cargando...
        </p>
      </div>
    </div>
  );
}
