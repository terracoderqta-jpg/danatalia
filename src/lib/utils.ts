import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price?: number | null): string {
  if (price == null || Number.isNaN(price) || price <= 0) return "Consultar";
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getWhatsAppLink(productName: string): string {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto "${productName}". ¿Podrían darme más información?`
  );
  return `https://wa.me/5493482312433?text=${message}`;
}
