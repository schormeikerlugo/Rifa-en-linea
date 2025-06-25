// 📁 admin.js
// Punto de entrada principal del panel de administración

import { cargarRifas } from './rifasAdmin.js';
import { manejarFormularioRifa } from './formRifasAdmin.js';    // <-- aquí apuntamos al archivo correcto
import { prepararEdicionRifa } from './editarRifa.js';
import { cargarReservasPorRifa, aprobarReserva, rechazarReserva } from './reservasAdmin.js';
import { mostrarFormulario, ocultarFormulario, volverAPrincipal } from './utilsAdmin.js';
import { mostrarModal, prepararModal } from './modalAdmin.js';

document.addEventListener('DOMContentLoaded', () => {
  prepararModal();       // 🎬 Inicializar eventos de modal
  cargarRifas();         // 🚀 Cargar rifas al inicio

  // Crear nueva rifa
  document.getElementById('btn-crear')?.addEventListener('click', mostrarFormulario);

  // Botón volver
  document.getElementById('btn-volver')?.addEventListener('click', () => {
    ocultarFormulario();
    volverAPrincipal();
  });

  // Manejo de formulario rifa
  const formRifa = document.getElementById('form-rifa');
  if (formRifa) manejarFormularioRifa(formRifa);

  // Filtros de reservas
  document.querySelectorAll('#filtrosReservas .filtro').forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.dataset.filtro;
      const rifaId = document.getElementById('lista-reservas').dataset.rifaId;
      cargarReservasPorRifa(rifaId, filtro);
    });
  });

  // Eventos delegados para reservas
  const lista = document.getElementById('lista-reservas');
  if (lista) {
    lista.addEventListener('click', async e => {
      const btn = e.target;
      const rifaId = lista.dataset.rifaId;
      const filtroActual = lista.dataset.filtro || 'pendiente';

      if (btn.matches('.aprobar')) {
        const ok = await aprobarReserva(btn.dataset.id);
        if (ok) await cargarReservasPorRifa(rifaId, filtroActual);
      }
      if (btn.matches('.rechazar')) {
        const ok = await rechazarReserva(btn.dataset.id);
        if (ok) await cargarReservasPorRifa(rifaId, filtroActual);
      }
    });
  }
});
