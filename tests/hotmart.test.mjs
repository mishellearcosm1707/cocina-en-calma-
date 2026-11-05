import test from 'node:test';
import assert from 'node:assert/strict';
import { estadoDeEvento, estadoDeVenta, extraer, hottokValido } from '../lib/hotmart.ts';

test('el hottok solo vale si es exactamente el esperado', () => {
  assert.equal(hottokValido('secreto', 'secreto'), true);
  assert.equal(hottokValido('secretos', 'secreto'), false);
  assert.equal(hottokValido('', 'secreto'), false);
  assert.equal(hottokValido(null, 'secreto'), false);
  assert.equal(hottokValido('secreto', undefined), false);
});

test('qué hace cada evento con el acceso y con la venta', () => {
  assert.equal(estadoDeEvento('PURCHASE_APPROVED'), 'activo');
  assert.equal(estadoDeEvento('PURCHASE_COMPLETE'), 'activo');
  assert.equal(estadoDeEvento('PURCHASE_REFUNDED'), 'reembolsado');
  assert.equal(estadoDeEvento('PURCHASE_CHARGEBACK'), 'reembolsado');
  assert.equal(estadoDeEvento('PURCHASE_CANCELED'), 'cancelado');
  assert.equal(estadoDeEvento('PURCHASE_DELAYED'), null);
  assert.equal(estadoDeEvento(undefined), null);
  assert.equal(estadoDeVenta('PURCHASE_REFUNDED'), 'reembolsada');
  assert.equal(estadoDeVenta('PURCHASE_CHARGEBACK'), 'contracargo');
});

test('extraer convierte importes a centavos y no inventa lo que falta', () => {
  const d = extraer({
    event: 'PURCHASE_APPROVED',
    data: {
      buyer: { email: '  Ana@Correo.COM ', name: ' Ana ' },
      product: { id: 123 },
      purchase: { transaction: 'HP1', approved_date: 1_700_000_000_000, price: { value: 14.99, currency_value: 'USD' }, origin: { src: 'ads_meta' } },
      commissions: [
        { source: 'MARKETPLACE', value: 1.48 },
        { source: 'PRODUCER', value: 13.51 },
      ],
    },
  });
  assert.equal(d.email, 'ana@correo.com');
  assert.equal(d.nombre, 'Ana');
  assert.equal(d.productoId, '123');
  assert.equal(d.bruto, 1499);
  assert.equal(d.feeHotmart, 148);
  assert.equal(d.netoProductor, 1351);
  assert.equal(d.afiliado, null);
  assert.equal(d.canal, 'ads_meta');
  assert.equal(d.moneda, 'USD');
  assert.equal(typeof d.fechaCompra, 'string');

  const vacio = extraer({ event: 'PURCHASE_APPROVED', data: { purchase: { transaction: 'HP2' } } });
  assert.equal(vacio.bruto, null);
  assert.equal(vacio.feeHotmart, null);
  assert.equal(vacio.canal, undefined);
  assert.equal(vacio.email, undefined);
});
