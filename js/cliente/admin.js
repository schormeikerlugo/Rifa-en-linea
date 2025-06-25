import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://wvebiyuoszwzsxavoitp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZWJpeXVvc3p3enN4YXZvaXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDAzMjksImV4cCI6MjA2NTY3NjMyOX0.l7SNxCXPfRsZ4uyTAmqpA00veBpZDbDAcy4oBBll5QI'
const supabase = createClient(supabaseUrl, supabaseKey)
const lista = document.getElementById('lista-reservas')

async function cargarReservas() {
  const { data, error } = await supabase
    .from('numeros')
    .select('*')
    .eq('estado', 'pendiente')

  if (error) {
    console.error('Error al cargar reservas:', error)
    return
  }

  lista.innerHTML = ''

  if (data.length === 0) {
  const mensaje = document.createElement('div')
  mensaje.className = 'sin-reservas'
  mensaje.innerHTML = `
    <img src="assets/sin-reservas.gif" alt="Sin reservas pendientes">
    <p>No hay reservas pendientes por ahora.</p>
  `
  lista.appendChild(mensaje)
  return
}

  data.forEach((item) => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <strong>Número:</strong> ${item.numero}<br>
      <strong>Nombre:</strong> ${item.nombre_cliente}<br>
      <strong>Teléfono:</strong> ${item.telefono_cliente}<br>
      <strong>Estado:</strong> ${item.estado}<br>
      <strong>Comprobante:</strong><br>
      <img src="${item.comprobante_url}" alt="Comprobante de pago"><br><br>
      <button onclick="aprobar('${item.id}')">Aprobar</button>
      <button class="rechazar" onclick="rechazar('${item.id}')">Rechazar</button>
    `;
    lista.appendChild(card)
  })

      // Mensaje al final de las reservas si hay alguna
      const mensajeFinal = document.createElement('div')
      mensajeFinal.className = 'mensaje-final'
      mensajeFinal.innerHTML = `
        <p>📝 Haz clic en “Aprobar” o “Rechazar” para gestionar las reservas.</p>
      `
      lista.appendChild(mensajeFinal)
}
// Crear una nueva rifa
document.getElementById('form-rifa').addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const fechaInicio = document.getElementById('fecha_inicio').value;
  const fechaFin = document.getElementById('fecha_fin').value;
  const imagen = document.getElementById('imagen_rifa').files[0];

  if (!titulo || !descripcion || !fechaInicio || !fechaFin || !imagen) {
    alert("Completa todos los campos.");
    return;
  }

  const nombreImagen = `rifas/${Date.now()}_${imagen.name}`;
  const { error: uploadError } = await supabase.storage
    .from('comprobantes') // usa tu bucket existente o crea uno nuevo llamado "rifas"
    .upload(nombreImagen, imagen);

  if (uploadError) {
    console.error("Error al subir imagen:", uploadError);
    alert("No se pudo subir la imagen.");
    return;
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from('comprobantes')
    .getPublicUrl(nombreImagen);

  const { error } = await supabase
    .from('rifas')
    .insert([{
      titulo,
      descripcion,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      imagen_url: publicUrl
    }]);

  if (error) {
    console.error("Error al guardar rifa:", error);
    alert("No se pudo crear la rifa.");
    return;
  }

  alert("Rifa creada exitosamente.");
  e.target.reset();
  // puedes llamar a una función para recargar la lista de rifas si tienes una
});


// Mostrar rifas existentes
async function cargarRifas() {
  const { data, error } = await supabase
    .from('rifas')
    .select('*')
    .order('fecha_inicio', { ascending: true });

  if (error) {
    console.error("Error al cargar rifas:", error);
    return;
  }

  const contenedor = document.getElementById('lista-rifas');
  contenedor.innerHTML = '';

  if (data.length === 0) {
    contenedor.innerHTML = `
      <div class="card">
        <p>No hay rifas creadas aún.</p>
      </div>`;
    return;
  }

  data.forEach(rifa => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${rifa.titulo}</h3>
      ${rifa.imagen_url ? `<img src="${rifa.imagen_url}" alt="Imagen de la rifa">` : ''}
      <p>${rifa.descripcion}</p>
      <p><strong>Inicio:</strong> ${new Date(rifa.fecha_inicio).toLocaleString()}</p>
      <p><strong>Fin:</strong> ${new Date(rifa.fecha_fin).toLocaleString()}</p>
      <button onclick="verReservas(${rifa.id})">Ver reservas</button>
      <button onclick="eliminarRifa(${rifa.id})" class="rechazar">Eliminar rifa</button>
    `;
    contenedor.appendChild(div);
  });
}


// Eliminar rifa (y luego sus números asociados)
window.eliminarRifa = async (id) => {
  const confirmar = confirm("¿Estás seguro de que quieres eliminar esta rifa? Se eliminarán todos los datos asociados.")
  if (!confirmar) return

  // Aquí puedes agregar lógica extra para eliminar cosas asociadas a la rifa si hay relación.

  const { error } = await supabase.from('rifas').delete().eq('id', id)

  if (error) {
    alert('Error al eliminar la rifa.')
    console.error(error)
    return
  }

  alert('Rifa eliminada con éxito.')
  cargarRifas()
}

// Llamar carga al iniciar
cargarRifas()


window.aprobar = async (id) => {
  const { error } = await supabase
    .from('numeros')
    .update({ estado: 'confirmado' })
    .eq('id', id)

  if (error) return alert('Error al aprobar.')
  cargarReservas()
}

window.rechazar = async (id) => {
  if (!confirm("¿Seguro que quieres rechazar esta reserva y liberar el número?")) return
  console.log('Rechazar:', id)
  const { error } = await supabase
    .from('numeros')
    .update({
      estado: 'disponible',
      nombre_cliente: null,
      
      correo_cliente: null,
      comprobante_url: null,
      fecha_seleccion: null
    })
    .eq('id', id)

  if (error) return alert('Error al rechazar.')
  cargarReservas()
}

cargarReservas()
cargarRifas();
