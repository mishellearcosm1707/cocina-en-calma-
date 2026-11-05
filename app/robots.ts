import type { MetadataRoute } from 'next';

// Los buscadores solo ven la página de ventas y las páginas legales; la app, el panel y la API quedan fuera.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/app', '/admin', '/api', '/auth', '/login', '/onboarding', '/paywall'] },
    sitemap: 'https://cocina-en-calma.vercel.app/sitemap.xml',
  };
}
