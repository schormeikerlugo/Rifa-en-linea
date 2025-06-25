// 📁 formRifasAdmin.js
import { supabase } from './supabaseClient.js';
import { mostrarModal } from './modalAdmin.js';
import { ocultarFormulario } from './utilsAdmin.js';
import { cargarRifas } from './rifasAdmin.js';

export function manejarFormularioRifa(formRifa) {
  formRifa.addEventListener('submit', async e => {
    e.preventDefault();
    const id = formRifa.dataset.editando === 'true' ? formRifa.dataset.rifaId : null;
    const titulo = formRifa.titulo.value.trim();
    const descripcion = formRifa.descripcion.value.trim();
    const fechaInicio = formRifa.fecha_inicio.value;
    const fechaFin = formRifa.fecha_fin.value;
    const imagenFile = formRifa.imagen_rifa.files[0];
    const extrasFiles = formRifa.imagenesExtra.files;

    if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
      mostrarModal('⚠️ Completa todos los campos.', 'advertencia');
      return;
    }

    // Subir/usar imágenes
    let imagenUrl = formRifa.dataset.imagenActual || null;
    if (imagenFile) {
      const path = `rifas/${Date.now()}_${imagenFile.name}`;
      const { error: upErr } = await supabase.storage.from('comprobantes').upload(path, imagenFile);
      if (upErr) { mostrarModal('❌ Error al subir imagen.', 'error'); return; }
      imagenUrl = supabase.storage.from('comprobantes').getPublicUrl(path).data.publicUrl;
    }

    let extrasUrls = JSON.parse(formRifa.dataset.imagenesExtrasActuales || '[]');
    if (extrasFiles.length) {
      extrasUrls = [];
      for (const file of extrasFiles) {
        const path = `rifas/extras/${Date.now()}_${file.name}`;
        const { error: err } = await supabase.storage.from('comprobantes').upload(path, file);
        if (err) { mostrarModal(`❌ Error al subir extra ${file.name}`, 'error'); return; }
        extrasUrls.push(supabase.storage.from('comprobantes').getPublicUrl(path).data.publicUrl);
      }
    }

    // Preparar datos
    const payload = { titulo, descripcion, fecha_inicio: fechaInicio, fecha_fin: fechaFin };
    if (imagenUrl) payload.imagen_url = imagenUrl;
    if (extrasUrls.length) payload.imagenes_extra = extrasUrls;

    if (id) {
      // ✏️ Editar
      const { error } = await supabase.from('rifas').update(payload).eq('id', id);
      if (error) { mostrarModal('❌ No se pudo actualizar.', 'error'); return; }
      mostrarModal('✅ Rifa actualizada.', 'exito');
    } else {
      // 🆕 Crear
      if (!imagenUrl) { mostrarModal('❌ Debes subir imagen principal.', 'error'); return; }
      const { data, error } = await supabase.from('rifas').insert([payload]).select().single();
      if (error || !data) { mostrarModal('❌ No se creó la rifa.', 'error'); return; }
      await generarNumerosParaRifa(data.id, parseInt(formRifa.cantidad_numeros.value));
    }

    // Reset
    formRifa.reset();
    delete formRifa.dataset.editando;
    delete formRifa.dataset.rifaId;
    delete formRifa.dataset.imagenActual;
    delete formRifa.dataset.imagenesExtrasActuales;
    ocultarFormulario();
    cargarRifas();
  });
}

// 🔢 Generar números
async function generarNumerosParaRifa(rifaId, cantidad) {
  const bloque = 1000, bloques = Math.ceil(cantidad / bloque);
  for (let b = 0; b < bloques; b++) {
    const inicio = b * bloque + 1, fin = Math.min((b+1)*bloque, cantidad);
    const nums = Array.from({ length: fin - inicio + 1 }, (_, i) => ({
      numero: inicio + i,
      estado: 'disponible',
      rifa_id: rifaId
    }));
    const { error } = await supabase.from('numeros').insert(nums);
    if (error) { mostrarModal(`❌ Error bloque ${b+1}`, 'error'); return; }
  }
  mostrarModal(`🎉 Creada con ${cantidad} números.`, 'exito');
}
