'use client';

import { useEffect, useRef } from 'react';

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Para ventanas que se abren encima de la pantalla (hojas de receta, selector): al abrir, el foco entra en la ventana;
 * Tab y Shift+Tab dan vueltas dentro de ella (no se escapan a lo de atrás); al cerrar, el foco vuelve a donde estaba.
 * Poner el `ref` devuelto en el elemento de la ventana (con tabIndex={-1}).
 */
export function useAtraparFoco(abierta: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!abierta) return;
    const previo = document.activeElement as HTMLElement | null;
    const el = ref.current;
    if (!el) return;
    const items = () => Array.from(el.querySelectorAll<HTMLElement>(ENFOCABLES)).filter((x) => x.offsetParent !== null);
    (items()[0] ?? el).focus({ preventScroll: true });
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const lista = items();
      if (!lista.length) {
        e.preventDefault();
        return;
      }
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    el.addEventListener('keydown', tecla);
    return () => {
      el.removeEventListener('keydown', tecla);
      previo?.focus?.({ preventScroll: true });
    };
  }, [abierta]);
  return ref;
}
