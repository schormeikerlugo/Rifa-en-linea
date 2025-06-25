// public/js/reservas.js
import { client } from './supabaseClient.js';
import { mostrarElemento, ocultarElemento, actualizarTexto, resetearFormulario, mostrarSeccion } from './uiHelpers.js';
import { mostrarModal } from './modal.js';
import { mostrarNumerosPorRifa } from './numerosUI.js';

let numeroSel = null;
let rifaSel = null;

const form = document.getElementById('formularioReserva');

export function mostrarFormularioReserva(num, rifaId) {
  numeroSel = num;
  rifaSel = rifaId;
  actualizarTexto('#numeroSeleccionado', num);
  mostrarElemento('#formularioReserva');
  form.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('btnConfirmar').addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const archivo = document.getElementById('comprobante').files[0];

  if (!nombre || !correo || !telefono || !archivo || !numeroSel || !rifaSel) {
    return mostrarModal('Completa todos los campos obligatorios.', 'advertencia');
  }

  const path = `${numeroSel}_${Date.now()}_${archivo.name}`;
  const { error: upErr } = await client.storage.from('comprobantes').upload(path, archivo);
  if (upErr) return mostrarModal('Error al subir comprobante. Intenta nuevamente.', 'error');

  const { data: pu, error: puErr } = await client.storage.from('comprobantes').getPublicUrl(path);
  if (puErr) return mostrarModal('No se pudo obtener el enlace del comprobante.', 'error');

  // Verificar si el número sigue disponible
  const { data: disponibilidad, error: errVerificar } = await client
    .from('numeros')
    .select('estado')
    .eq('numero', numeroSel)
    .eq('rifa_id', rifaSel)
    .single();

  if (errVerificar || !disponibilidad || disponibilidad.estado !== 'disponible') {
    return mostrarModal('Ese número ya fue reservado. Por favor, elige otro.', 'advertencia');
  }

  const { error: updErr } = await client
    .from('numeros')
    .update({
      estado: 'pendiente',
      nombre_cliente: nombre,
      correo_cliente: correo,
      telefono_cliente: telefono,
      fecha_seleccion: new Date().toISOString(),
      comprobante_url: pu.publicUrl
    })
    .eq('numero', numeroSel)
    .eq('rifa_id', rifaSel);

  if (updErr) return mostrarModal('No se pudo realizar la reserva.', 'error');

  mostrarModal('✅ ¡Reserva enviada! Te notificaremos cuando tu comprobante sea verificado.', 'exito');

  numeroSel = null;
  rifaSel = null;
  resetearFormulario('#formularioReserva');
  ocultarElemento('#formularioReserva');
  mostrarElemento('#rifasSection');
  await cargarRifas(); // Recargar las rifas para reflejar el cambio
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Llevar
});

// ✅ Botón para volver a seleccionar un número
document.getElementById('formVolver').addEventListener('click', async () => {
  // 🧹 Ocultar y limpiar formulario
  resetearFormulario('#formularioReserva');
  ocultarElemento('#formularioReserva');

  // 🧹 Limpiar el contenedor de números
  const cont = document.getElementById('numerosContainer');
  cont.innerHTML = '';

  // 🔁 Volver a cargar los números de la rifa actual
  if (rifaSel) {
    await mostrarNumerosPorRifa(rifaSel);
    mostrarSeccion('numerosSection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});