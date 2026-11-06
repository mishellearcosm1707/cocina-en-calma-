'use client';

import { useEffect } from 'react';
import { guardarCanalDeLaDireccion } from '@/lib/canal';

/** No dibuja nada: solo recuerda de qué anuncio o enlace llegó la persona (?src=). */
export function CapturaCanal() {
  useEffect(() => {
    guardarCanalDeLaDireccion();
  }, []);
  return null;
}
