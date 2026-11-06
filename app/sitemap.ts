import type { MetadataRoute } from 'next';

const BASE = 'https://cocina-en-calma.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/terminos', '/privacidad', '/reembolsos', '/cookies', '/aviso-salud'].map((ruta) => ({ url: BASE + ruta, changeFrequency: 'monthly', priority: ruta === '' ? 1 : 0.3 }));
}
