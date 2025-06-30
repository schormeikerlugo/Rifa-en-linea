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

  // Imagen
  const img = document.createElement('img');
  img.src = rifa.imagen_url || 'https://via.placeholder.com/300x150';
  img.alt = rifa.titulo;

  // Info
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('rifa-info');

  const titulo = document.createElement('h3');
  titulo.classList.add('rifa-titulo');
  titulo.textContent = rifa.titulo;

  const fechaInicio = document.createElement('p');
  fechaInicio.classList.add('fecha_inicio');
  fechaInicio.innerHTML = `📅 <strong>Inicio:</strong> ${formatearFecha(rifa.fecha_inicio)}`;

  const fechaFin = document.createElement('p');
  fechaFin.classList.add('fecha_fin');
  fechaFin.innerHTML = `📅 <strong>Fin:</strong> ${formatearFecha(rifa.fecha_fin)}`;

  const descripcion = document.createElement('p');
  descripcion.classList.add('rifa-descripcion');
  descripcion.textContent = rifa.descripcion || '';

  infoDiv.appendChild(titulo);
  infoDiv.appendChild(fechaInicio);
  infoDiv.appendChild(fechaFin);
  infoDiv.appendChild(descripcion);

  card.appendChild(img);
  card.appendChild(infoDiv);

  card.addEventListener('click', () => {
    mostrarNumerosPorRifa(rifa.id, rifa);
    mostrarSeccion('numerosSection');
  });

  contenedor.appendChild(card);
});
}
