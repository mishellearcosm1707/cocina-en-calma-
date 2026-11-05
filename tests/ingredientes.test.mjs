import test from 'node:test';
import assert from 'node:assert/strict';
import { claveIngrediente, nombresIngrediente } from '../lib/ingredientes.ts';

test('limpia cantidades, unidades y notas', () => {
  assert.deepEqual(nombresIngrediente('1½ taza de arroz integral cocido'), ['Arroz integral']);
  assert.deepEqual(nombresIngrediente('1 y ½ taza de arroz integral cocido'), ['Arroz integral']);
  assert.deepEqual(nombresIngrediente('1 camote mediano cocido y hecho puré'), ['Camote']);
  assert.deepEqual(nombresIngrediente('2 cdas de aceite de oliva'), ['Aceite de oliva']);
});

test('el jugo y la ralladura se compran como la fruta', () => {
  assert.deepEqual(nombresIngrediente('Jugo de 1 limón'), ['Limón']);
  assert.deepEqual(nombresIngrediente('Jugo de ½ limón'), ['Limón']);
  assert.deepEqual(nombresIngrediente('Jugo y ralladura de 2 limones'), ['Limones']);
});

test('sal y pimienta son un solo renglón; líneas con varios ingredientes se separan', () => {
  assert.deepEqual(nombresIngrediente('Sal y pimienta al gusto'), ['Sal y pimienta']);
  assert.deepEqual(nombresIngrediente('Sal'), ['Sal y pimienta']);
  assert.deepEqual(nombresIngrediente('1 manzana y ½ pera'), ['Manzana', 'Pera']);
  assert.deepEqual(nombresIngrediente('½ taza de yogur natural + ralladura de limón'), ['Yogur natural', 'Limón']);
});

test('singular y plural se juntan en la lista', () => {
  assert.equal(claveIngrediente('Huevos'), claveIngrediente('Huevo'));
  assert.equal(claveIngrediente('Manzanas'), claveIngrediente('Manzana'));
  assert.notEqual(claveIngrediente('Aceite de oliva'), claveIngrediente('Aceite'));
});
