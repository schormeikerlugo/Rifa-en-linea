// js/cargarRifas.js
import { client } from './supabaseClient.js';
import { mostrarNumerosPorRifa } from './numerosUI.js';
import { mostrarSeccion } from './uiHelpers.js';

export async function cargarRifas() {
  const { data, error } = await client
    .from('rifas')
    .select('id, titulo, descripcion, imagen_url, fecha_inicio, fecha_fin, imagenes_extra')
    .order('fecha_inicio', { ascending: true });

  if (error) {
    mostrarModal('Error al cargar rifas:.', 'error');
    return;
  }

  const contenedor = document.getElementById('rifasContainer');
  if (!contenedor) {
    mostrarModal('Contenedor de rifas no encontrado.', 'error');
    return;
  }

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  contenedor.innerHTML = '';

  data.forEach(rifa => {
    const card = document.createElement('div');
    card.classList.add('rifa-card');
    card.innerHTML = `
      <img src="${rifa.imagen_url || 'https://via.placeholder.com/300x150'}" alt="${rifa.titulo}">
      <div class="rifa-info">
        <h3 class="rifa-titulo">${rifa.titulo}</h3>
        <p class="fecha_inicio">📅 <strong>Inicio:</strong> ${formatearFecha(rifa.fecha_inicio)}</p>
        <p class="fecha_fin">📅 <strong>Fin:</strong> ${formatearFecha(rifa.fecha_fin)}</p>
        <p class="rifa-descripcion">${rifa.descripcion || ''}</p>
      </div>
    `;

    // ✅ Pasamos id y objeto completo
    card.addEventListener('click', () => {
      mostrarNumerosPorRifa(rifa.id, rifa);
      mostrarSeccion('numerosSection');
    });

    contenedor.appendChild(card);
  });
}
