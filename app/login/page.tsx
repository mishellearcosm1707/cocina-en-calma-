import type { Metadata } from 'next';
import { Login } from '@/components/login/Login';

export const metadata: Metadata = {
  title: 'Entra a tu Menú Calma — Cocina en Calma',
  description: 'Entra con el correo de tu compra y recibe tu enlace de acceso, sin contraseñas.',
  robots: { index: false },
};

export default function PaginaLogin() {
  return <Login />;
}
