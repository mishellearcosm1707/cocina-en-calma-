import type { MetadataRoute } from 'next';

// Permite "Agregar a la pantalla de inicio": la app se abre como una app, con su ícono y sin la barra del navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cocina en Calma',
    short_name: 'Cocina en Calma',
    description: 'Menús antiinflamatorios según tu síntoma y lo que tienes en casa.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#F4F0E4',
    theme_color: '#4F6F2B',
    lang: 'es',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
  };
}
