'use client';

// Landing de Cocina en Calma — compuesta desde el kit (components/landing/) con el copy de
// docs/copy/landing.md (trazado a FICHA-AVATAR.md). Modelo 2: el CTA lleva a /onboarding.

import { ChefHat, Moon, Scale, Shirt } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { OfertaUnica } from '@/components/landing/OfertaUnica';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Ver mi menú de hoy gratis';
const CTA_OFERTA = 'Ver mi menú de hoy gratis';

export default function Landing() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="Cocina en Calma"
        h1Marked="Termina el día más [acento]ligera[/acento], sin pesar ni contar calorías"
        subtitleMarked="El Menú Calma arma tu día con tu [b]síntoma[/b] y tu despensa"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Pruébalo gratis · $14.99 una sola vez si te quedas · 15 días de garantía</span>}
        visual={<img src="/mocks/real-menu.jpg" alt="Tu primer menú de hoy con 4 comidas y la barra 100% cubierto" width={250} height={518} className="mx-auto w-[250px] rounded-[30px] shadow-[var(--shadow-2)]" />}
      />

      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: Moon, textoMarked: '¿Tu panza amanece plana y por la noche parece de [b]5 meses[/b]?' },
          { icon: Shirt, textoMarked: '¿Te aprieta el pantalón [b]después de comer[/b], hasta con agua?' },
          { icon: ChefHat, textoMarked: '¿Llegas agotada y no sabes [b]qué cocinar hoy[/b]?' },
          { icon: Scale, textoMarked: '¿Estás harta de pesar la comida y [b]contar calorías[/b]?' },
        ]}
      />

      <Agitacion
        frases={[
          'Decides qué comer [b]3 o 4 veces al día[/b], todos los días.',
          'Contar gramos no calma tu abdomen: solo suma [acento]culpa y ansiedad[/acento].',
          'Las dietas que prohíben todo se abandonan, y la hinchazón [b]vuelve[/b].',
        ]}
      />

      <Solucion
        tituloMarked="Un menú armado con tu [acento]síntoma[/acento] y tu nevera"
        mecanismo="el Menú Calma"
        bigIdeaMarked="No necesitas contar nada: el Menú Calma arma tu día con [b]tu síntoma, tu despensa y lo que tu cuerpo necesita[/b]."
        pasos={[
          { titulo: 'Cuéntanos cómo te sientes', detalle: 'Marca tu síntoma y 3 ingredientes que tengas en casa.' },
          { titulo: 'Se arma tu Menú Calma', detalle: 'Recetas antiinflamatorias que cubren lo que tu cuerpo necesita hoy.' },
          { titulo: 'Cocinas una vez, comes toda la semana', detalle: 'Armas tus 7 días y recibes tu meal prep y tus compras.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Improvisar cada noche, pesar gramos y sentirte culpable.',
          labelDespues: 'Después',
          despues: 'Un menú listo, sin báscula y una sola tarde de cocina.',
        }}
      />

      <AppPorDentro
        tituloMarked="Tu semana, [acento]ya resuelta[/acento]"
        frames={[
          { label: 'Dinos cómo te sientes', nombrePantalla: 'Síntomas', src: '/mocks/real-sintomas.jpg', alt: 'Pantalla donde marcas cómo te sientes hoy' },
          { label: 'Marca lo que tienes en casa', nombrePantalla: 'Ingredientes', src: '/mocks/real-ingredientes.jpg', alt: 'Pantalla donde marcas 3 ingredientes de tu cocina' },
          { label: 'Sabe lo que necesita tu cuerpo', nombrePantalla: 'Tu cuerpo', src: '/mocks/real-cuerpo.jpg', alt: 'Pantalla con el reparto de tu día entre las 4 comidas' },
          { label: 'Tu primer menú de hoy', nombrePantalla: 'Menú de hoy', src: '/mocks/real-menu.jpg', alt: 'Tu menú de hoy con 4 recetas y cuánto cubre de tu día' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <OfertaUnica
        tituloMarked="Un solo pago. [acento]Sin mensualidades[/acento]"
        plan={{
          nombre: 'Cocina en Calma',
          precio: '$14.99',
          sufijo: 'pago único',
          descomposicionDia: 'Menos de $0.05 al día si la usas un año',
          ancla: 'Una sola consulta con nutricionista cuesta más.',
          features: [
            'Menú de cada día según tu síntoma y tu despensa',
            'Tus requerimientos del día, calculados con solo 6 datos',
            '60 recetas antiinflamatorias para elegir',
            'Meal prep guiado de una tarde y lista de compras',
            'Chequeo diario que ajusta tu menú de mañana',
          ],
          ctaLabel: CTA_OFERTA,
          ctaHref: CTA_HREF,
          microcopyCta: 'Pagas $14.99 solo si te quedas con tu menú · Garantía Calma de 15 días',
        }}
      />

      <Garantia
        nombre="Garantía Calma de 15 días"
        condicionMarked="Si en 15 días tu Menú Calma no te convence, escribes un correo y te devolvemos [b]todo tu pago[/b]. Sin preguntas."
        pisoLegal="15 días para decidir, sin letra chica"
      />

      <Faq
        items={[
          {
            pregunta: '¿Tengo que pesar la comida o contar calorías?',
            respuestaMarked: 'No. Usamos tazas, puños y unidades. La app hace las cuentas: [b]tú solo eliges qué comer[/b].',
          },
          {
            pregunta: '¿Las recetas llevan ingredientes raros o caros?',
            respuestaMarked: 'No. Todo se consigue en cualquier supermercado, y el menú se arma con [b]lo que ya tienes[/b].',
          },
          {
            pregunta: '¿Y si no tengo tiempo para cocinar el domingo?',
            respuestaMarked: 'Hay Menús Express de 10 minutos. Y cocinar una vez [b]te ahorra cocinar cada noche[/b].',
          },
          {
            pregunta: '¿Reemplaza a mi médico o nutricionista?',
            respuestaMarked:
              'No. Es orientación nutricional general, no un servicio médico. Si tienes una condición de salud, consúltalo con tu profesional.',
          },
          {
            pregunta: '¿Es una suscripción? ¿Cómo pago?',
            respuestaMarked: 'No. Pagas $14.99 una sola vez, con tarjeta u otros métodos según tu país. [b]Sin renovaciones[/b] y con 15 días de garantía.',
          },
          {
            pregunta: '¿Qué pasa con mis datos de salud?',
            respuestaMarked: 'Solo los usamos para armar tu menú. No los vendemos y puedes [b]borrar tu cuenta[/b] cuando quieras.',
          },
        ]}
      />

      <CtaFinal
        h2Marked="Imagina cenar tranquila y [acento]sentirte ligera[/acento]"
        futurePacingMarked="Esta noche marcas cómo te sientes, eliges 3 ingredientes y ya sabes qué cocinar, sin báscula."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Pruébalo gratis · $14.99 una sola vez si te quedas · 15 días de garantía"
        psMarked="PS: Cocina en Calma arma tu menú con tu síntoma y tu despensa. Pruébalo gratis hoy; si decides quedártelo, es un solo pago de $14.99 con 15 días de garantía."
      />

      <FooterLegal
        appName="Cocina en Calma"
        logo={<span aria-hidden="true" className="size-5 rounded-[6px] bg-[var(--accent)]" />}
        anio={2026} /* fijo: new Date() no puede evaluarse en un client component prerenderizado */
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Aviso de salud', href: '/aviso-salud' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
