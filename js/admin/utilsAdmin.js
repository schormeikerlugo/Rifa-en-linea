import { mostrarElemento, ocultarElemento } from './uiAdminHelpers.js';

/**
 * Mostrar el formulario de creación de rifa
 */
export function mostrarFormulario() {
  mostrarElemento('#seccion-formulario');
  ocultarElemento('#seccion-principal');
  ocultarElemento('#lista-rifas');
  ocultarElemento('#lista-reservas');
  mostrarElemento('#form-rifa');
  ocultarElemento('#filtrosReservas');
  mostrarElemento('#btn-volver');
  ocultarElemento('#btn-crear');
}

/**
 * Ocultar el formulario y volver a la pantalla principal
 */
export function ocultarFormulario() {
  ocultarElemento('#seccion-formulario');
  mostrarElemento('#seccion-principal');
  mostrarElemento('#lista-rifas');
  ocultarElemento('#lista-reservas');
  ocultarElemento('#form-rifa');
  ocultarElemento('#filtrosReservas');
  mostrarElemento('#btn-crear');
  ocultarElemento('#btn-volver');
}

/**
 * Mostrar la lista de reservas de una rifa
 */
export function mostrarReservasUI() {
  ocultarElemento('#form-rifa');
  ocultarElemento('#lista-rifas');
  ocultarElemento('#btn-crear');
  mostrarElemento('#lista-reservas');
  mostrarElemento('#btn-volver');
  mostrarElemento('#filtrosReservas');
}

/**
 * Volver a la pantalla principal desde reservas
 */
export function volverAPrincipal() {
  ocultarElemento('#form-rifa');
  ocultarElemento('#lista-reservas');
  mostrarElemento('#lista-rifas');
  mostrarElemento('#btn-crear');
  ocultarElemento('#btn-volver');
  ocultarElemento('#filtrosReservas');
}