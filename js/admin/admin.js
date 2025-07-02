// 📁 admin.js
// Punto de entrada principal del panel de administración

import { cargarRifas } from './rifasAdmin.js';
import { manejarFormularioRifa } from './formRifasAdmin.js';
import { cargarReservasPorRifa, aprobarReserva, rechazarReserva } from './reservasAdmin.js';
import { mostrarFormulario, ocultarFormulario, volverAPrincipal, resetearFormularioRifa } from './utilsAdmin.js';
import { prepararModal } from './modalAdmin.js';

document.addEventListener('DOMContentLoaded', () => {
  prepararModal();       // 🎬 Inicializar eventos de modal
  cargarRifas();         // 🚀 Cargar rifas al inicio

  // Manejo del formulario
  const formRifa = document.getElementById('form-rifa');

  // Crear nueva rifa
  document.getElementById('btn-crear')?.addEventListener('click', () => {  
    mostrarFormulario();
    resetearFormularioRifa(formRifa);
  });

  // Botón volver
  document.getElementById('btn-volver')?.addEventListener('click', () => {
    ocultarFormulario();
    volverAPrincipal();
    resetearFormularioRifa(formRifa);
  });

  // Manejo de formulario rifa
  if (formRifa) manejarFormularioRifa(formRifa);

  // Filtros de reservas
  document.querySelectorAll('#filtrosReservas .filtro').forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.dataset.filtro;
      const rifaId = document.getElementById('lista-reservas').dataset.rifaId;
      cargarReservasPorRifa(rifaId, filtro);
    });
  });

  // Eventos delegados para aprobar/rechazar reservas
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
