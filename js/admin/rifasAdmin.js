// js/admin/rifasAdmin.js
import { prepararEdicionRifa } from './editarRifa.js';
import { cargarReservasPorRifa } from './reservasAdmin.js';
import { mostrarReservasUI } from './utilsAdmin.js';      // <<<
import { mostrarModal, mostrarModalConfirmacion } from './modalAdmin.js';
import { supabase } from './supabaseClient.js';

const contenedor = document.getElementById('lista-rifas');
const template  = document.getElementById('rifa-card-template');

export async function cargarRifas() {
  const { data, error } = await supabase
    .from('rifas')
    .select('*')
    .order('fecha_inicio');

  contenedor.innerHTML = '';
  if (error) return mostrarModal('Error al cargar rifas.', 'error'); //❌
  if (!data.length) return contenedor.innerHTML = '<p>No hay rifas.</p>'; // podria integrar un gif de "no hay rifas" aquí

  data.forEach(rifa => {
    const clone = template.content.cloneNode(true);

    // Rellenar datos
    clone.querySelector('img').src = rifa.imagen_url;
    clone.querySelector('.rifa-titulo').textContent       = rifa.titulo;
    clone.querySelector('.rifa-descripcion').textContent = rifa.descripcion;
    clone.querySelector('.rifa-fecha-inicio').textContent = new Date(rifa.fecha_inicio).toLocaleString();
    clone.querySelector('.rifa-fecha-fin').textContent    = new Date(rifa.fecha_fin).toLocaleString();

    // Ver reservas
    const btnVer = clone.querySelector('.ver-reservas');
    btnVer.dataset.id = rifa.id;
    btnVer.addEventListener('click', () => {
      mostrarReservasUI();                // Muestra la sección de reservas
      cargarReservasPorRifa(rifa.id);     // Carga los datos
    });

    // Eliminar rifa
    const btnDel = clone.querySelector('.eliminar-rifa');
    btnDel.dataset.id = rifa.id;
    btnDel.addEventListener('click', async () => {
      if (! await mostrarModalConfirmacion('¿Eliminar rifa?', 'advertencia', 'eliminar')) return; 
      const { error } = await supabase.from('rifas').delete().eq('id', rifa.id);
      if (error) return mostrarModal('No se pudo eliminar.', 'error'); //❌
      mostrarModal('Rifa eliminada.', 'aprobado');
      cargarRifas();
    });

    // Editar rifa
    const btnEdit = clone.querySelector('.editar-rifa');
    btnEdit.dataset.id = rifa.id;
    btnEdit.addEventListener('click', async () => {
      const { data: r, error } = await supabase
        .from('rifas')
        .select('*')
        .eq('id', rifa.id)
        .single();
      if (error) return mostrarModal('No se pudo cargar.', 'error'); //❌
      prepararEdicionRifa(btnEdit, r);
    });

    contenedor.appendChild(clone);
  });
}
