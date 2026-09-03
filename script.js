// Precios base inmediatos
let LISTA_PRECIOS = {
  'T100': 350000,
  'T70P': 280000,
  'T55': 240000,
  'T25P': 180000,
  'BAT-IND': 22000,
  'GEN-IND': 35000,
  'GRAN-IND': 12000,
  'BOQ-IND': 4500
};

let CATALOGO = {
  'T100': { codigo: 'T100', nombre: 'DJI Agras T100', imagen: 't100 ..png' },
  'T70P': { codigo: 'T70P', nombre: 'DJI Agras T70P', imagen: 't70p.png' },
  'T55':  { codigo: 'T55',  nombre: 'DJI Agras T55',  imagen: 't55 solo.png' },
  'T25P': { codigo: 'T25P', nombre: 'DJI Agras T25P', imagen: 't25p.png' }
};

let productoSeleccionado = null;
let carrito = [];

function formatearMXN(monto) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto || 0);
}

// Carga inicial y respaldo
document.addEventListener("DOMContentLoaded", () => {
  // Renderizar precios inmediatamente
  actualizarEtiquetasPreciosTarjetas();

  // Intentar actualizar con el JSON si existe
  fetch('precios.json')
    .then(res => {
      if (!res.ok) throw new Error("JSON no encontrado");
      return res.json();
    })
    .then(datos => {
      datos.forEach(item => {
        if (item.codigo) {
          LISTA_PRECIOS[item.codigo] = parseFloat(item.precio_mxn) || LISTA_PRECIOS[item.codigo];
          if (item.nombre || item.imagen) {
            CATALOGO[item.codigo] = {
              codigo: item.codigo,
              nombre: item.nombre || CATALOGO[item.codigo]?.nombre,
              imagen: item.imagen || CATALOGO[item.codigo]?.imagen
            };
          }
        }
      });
      actualizarEtiquetasPreciosTarjetas();
    })
    .catch(err => console.log("Usando lista de precios de respaldo local."));
});

function actualizarEtiquetasPreciosTarjetas() {
  const codigos = ['T100', 'T70P', 'T55', 'T25P'];
  codigos.forEach(cod => {
    const el = document.getElementById(`precio-tarjeta-${cod}`);
    if (el) {
      el.innerText = `${formatearMXN(LISTA_PRECIOS[cod])} MXN`;
    }
  });
}

function seleccionarProductoPorCodigo(codigo) {
  const info = CATALOGO[codigo] || {
    codigo: codigo,
    nombre: `DJI Agras ${codigo}`,
    imagen: `img/${codigo.toLowerCase()}.jpg`
  };

  productoSeleccionado = { id: info.codigo, nombre: info.nombre, imagen: info.imagen };

  const elTitulo = document.getElementById('detalle-titulo');
  const elImagen = document.getElementById('detalle-imagen');
  const elControles = document.getElementById('controles-dron');

  if (elTitulo) elTitulo.innerText = info.nombre;
  if (elImagen) {
    elImagen.src = info.imagen;
    elImagen.onerror = function() {
      this.src = `https://via.placeholder.com/300x200?text=${info.nombre.replace(/ /g, '+')}`;
    };
  }
  if (elControles) elControles.style.display = 'block';

  const inputDrones = document.getElementById('cantidad-drones');
  if (inputDrones) inputDrones.value = 1;

  actualizarLimitesAccesorios(1);
}

function actualizarLimitesAccesorios(numDrones) {
  const setLabel = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

  setLabel('max-bat-label', numDrones * 6);
  setLabel('max-gen-label', numDrones * 2);
  setLabel('max-gran-label', numDrones * 1);
  setLabel('max-boq-label', numDrones * 1);

  setVal('cantidad-baterias', numDrones * 3);
  setVal('cantidad-generadores', numDrones * 1);
  setVal('cantidad-granulado', 0);
  setVal('cantidad-boquillas', 0);

  calcularTotalCombo();
}

function calcularTotalCombo() {
  if (!productoSeleccionado) return 0;

  const getVal = (id) => { const el = document.getElementById(id); return el ? (parseInt(el.value) || 0) : 0; };

  const numDrones = getVal('cantidad-drones');
  const numBat = getVal('cantidad-baterias');
  const numGen = getVal('cantidad-generadores');
  const numGran = getVal('cantidad-granulado');
  const numBoq = getVal('cantidad-boquillas');

  const total = (numDrones * (LISTA_PRECIOS[productoSeleccionado.id] || 0)) +
                (numBat * (LISTA_PRECIOS['BAT-IND'] || 0)) +
                (numGen * (LISTA_PRECIOS['GEN-IND'] || 0)) +
                (numGran * (LISTA_PRECIOS['GRAN-IND'] || 0)) +
                (numBoq * (LISTA_PRECIOS['BOQ-IND'] || 0));

  const elTotalCombo = document.getElementById('total-combo-monto');
  if (elTotalCombo) elTotalCombo.innerText = `${formatearMXN(total)} MXN`;

  return total;
}

function ajustarDrones(delta) {
  let input = document.getElementById('cantidad-drones');
  if (!input) return;
  let valor = (parseInt(input.value) || 1) + delta;
  if (valor < 1) valor = 1;
  input.value = valor;
  actualizarLimitesAccesorios(valor);
}

function ajustarBaterias(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones')?.value) || 1;
  const max = numDrones * 6;
  let input = document.getElementById('cantidad-baterias');
  if (!input) return;
  let val = (parseInt(input.value) || 0) + delta;
  if (val < 0) val = 0;
  if (val > max) { alert(`Máximo ${max} baterías para ${numDrones} equipos.`); val = max; }
  input.value = val;
  calcularTotalCombo();
}

function ajustarGeneradores(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones')?.value) || 1;
  const max = numDrones * 2;
  let input = document.getElementById('cantidad-generadores');
  if (!input) return;
  let val = (parseInt(input.value) || 0) + delta;
  if (val < 0) val = 0;
  if (val > max) { alert(`Máximo ${max} generadores para ${numDrones} equipos.`); val = max; }
  input.value = val;
  calcularTotalCombo();
}

function ajustarGranulado(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones')?.value) || 1;
  const max = numDrones * 1;
  let input = document.getElementById('cantidad-granulado');
  if (!input) return;
  let val = (parseInt(input.value) || 0) + delta;
  if (val < 0) val = 0;
  if (val > max) { alert(`Máximo ${max} tanque de granulado para ${numDrones} equipos.`); val = max; }
  input.value = val;
  calcularTotalCombo();
}

function ajustarBoquillas(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones')?.value) || 1;
  const max = numDrones * 1;
  let input = document.getElementById('cantidad-boquillas');
  if (!input) return;
  let val = (parseInt(input.value) || 0) + delta;
  if (val < 0) val = 0;
  if (val > max) { alert(`Máximo ${max} kit de boquillas para ${numDrones} equipos.`); val = max; }
  input.value = val;
  calcularTotalCombo();
}

function agregarDronAlCarrito() {
  if (!productoSeleccionado) {
    alert("Por favor selecciona un modelo de dron.");
    return;
  }

  const getVal = (id) => parseInt(document.getElementById(id)?.value) || 0;

  const item = {
    id: productoSeleccionado.id,
    nombre: productoSeleccionado.nombre,
    drones: getVal('cantidad-drones') || 1,
    baterias: getVal('cantidad-baterias'),
    generadores: getVal('cantidad-generadores'),
    granulado: getVal('cantidad-granulado'),
    boquillas: getVal('cantidad-boquillas'),
    subtotal: calcularTotalCombo()
  };

  carrito.push(item);
  actualizarBadge();
  alert(`Agregado: ${item.drones}x ${productoSeleccionado.nombre}`);
}

function actualizarBadge() {
  const elBadge = document.getElementById('badge-contador');
  if (elBadge) elBadge.innerText = carrito.length;
}

function abrirModalCarrito() {
  const modal = document.getElementById('modal-carrito');
  const lista = document.getElementById('lista-carrito');
  if (modal) modal.style.display = 'flex';
  if (!lista) return;

  if (carrito.length === 0) {
    lista.innerHTML = '<p>El pedido está vacío.</p>';
    document.getElementById('total-general-monto').innerText = "$0.00 MXN";
    return;
  }

  let html = '<ul style="list-style:none; padding:0;">';
  let totalGeneral = 0;

  carrito.forEach((item, index) => {
    totalGeneral += item.subtotal;
    html += `
      <li style="border-bottom: 1px solid #ddd; padding: 8px 0;">
        <b>${item.nombre}</b>: ${item.drones} Equipos | ${item.baterias} Bat. | ${item.generadores} Gen. | ${item.granulado} Gran. | ${item.boquillas} Boq.<br>
        <small>Subtotal: <b>${formatearMXN(item.subtotal)} MXN</b></small>
        <button onclick="eliminarItemCarrito(${index})" style="margin-left: 10px; color: red; border: none; background: none; cursor: pointer;">[Eliminar]</button>
      </li>`;
  });
  html += '</ul>';
  lista.innerHTML = html;
  document.getElementById('total-general-monto').innerText = `${formatearMXN(totalGeneral)} MXN`;
}

function eliminarItemCarrito(index) {
  carrito.splice(index, 1);
  actualizarBadge();
  abrirModalCarrito();
}

function cerrarModalCarrito() {
  const modal = document.getElementById('modal-carrito');
  if (modal) modal.style.display = 'none';
}

function enviarPedidoALark() {
  const cliente = document.getElementById('nombre-cliente')?.value.trim();
  if (!cliente) {
    alert("Por favor ingresa el nombre del distribuidor.");
    return;
  }
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  console.log("Enviando Pedido:", { cliente, pedido: carrito });
  alert("¡Pedido enviado a Logística exitosamente!");
  carrito = [];
  actualizarBadge();
  cerrarModalCarrito();
}
