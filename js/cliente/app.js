// public/js/app.js
import { cargarRifas } from './cargarRifas.js';
import { mostrarSeccion } from './uiHelpers.js';
import { prepararModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  prepararModal();
});

document.addEventListener('DOMContentLoaded', async () => {
  await cargarRifas();
  // botón "Volver"
document.getElementById('volverBtn').addEventListener('click', () => {
  document.getElementById('numerosContainer').innerHTML = ''; // 🧹 Vacía los números
  mostrarSeccion('rifasSection');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

});