let LISTA_PRECIOS = {
  // Precios de respaldo por si el JSON no ha terminado de cargar
  'T100': 350000,
  'T70P': 280000,
  'T55': 240000,
  'T25P': 180000,
  'BAT-IND': 22000,
  'GEN-IND': 35000,
  'GRAN-IND': 12000,
  'BOQ-IND': 4500
};

let productoSeleccionado = null;
let carrito = [];

// Formateador de moneda MXN
function formatearMXN(monto) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto || 0);
}

// Cargar la lista de precios desde el JSON al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch('precios.json');
    if (respuesta.ok) {
      const datos = await respuesta.json();
      datos.forEach(item => {
        if (item.codigo && item.precio_mxn) {
          LISTA_PRECIOS[item.codigo] = parseFloat(item.precio_mxn);
        }
      });
      console.log("Precios cargados desde precios.json:", LISTA_PRECIOS);
    }
  } catch (error) {
    console.warn("No se pudo cargar precios.json. Usando precios de respaldo.", error);
  }

  actualizarEtiquetasPreciosTarjetas();
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

function seleccionarProducto(id, nombre, imagen) {
  productoSeleccionado = { id, nombre, imagen };
  
  const elTitulo = document.getElementById('detalle-titulo');
  const elImagen = document.getElementById('detalle-imagen');
  const elControles = document.getElementById('controles-dron');

  if (elTitulo) elTitulo.innerText = nombre;
  if (elImagen) elImagen.src = imagen;
  if (elControles) elControles.style.display = 'block';
  
  const inputDrones = document.getElementById('cantidad-drones');
  if (inputDrones) inputDrones.value = 1;

  actualizarLimitesAccesorios(1);
}

function actualizarLimitesAccesorios(numDrones) {
  const maxBaterias = numDrones * 6;
  const maxGeneradores = numDrones * 2;
  const maxGranulado = numDrones * 1;
  const maxBoquillas = numDrones * 1;

  const setLabel = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setLabel('max-bat-label', maxBaterias);
  setLabel('max-gen-label', maxGeneradores);
  setLabel('max-gran-label', maxGranulado);
  setLabel('max-boq-label', maxBoquillas);

  setVal('cantidad-baterias', numDrones * 3);
  setVal('cantidad-generadores', numDrones * 1);
  setVal('cantidad-granulado', 0);
  setVal('cantidad-boquillas', 0);

  calcularTotalCombo();
}

function calcularTotalCombo() {
  if (!productoSeleccionado) return 0;

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? (parseInt(el.value) || 0) : 0;
  };

  const numDrones = getVal('cantidad-drones');
  const numBat = getVal('cantidad-baterias');
  const numGen = getVal('cantidad-generadores');
  const numGran = getVal('cantidad-granulado');
  const numBoq = getVal('cantidad-boquillas');

  const precioDron = LISTA_PRECIOS[productoSeleccionado.id] || 0;
  const precioBat = LISTA_PRECIOS['BAT-IND'] || 0;
  const precioGen = LISTA_PRECIOS['GEN-IND'] || 0;
  const precioGran = LISTA_PRECIOS['GRAN-IND'] || 0;
  const precioBoq = LISTA_PRECIOS['BOQ-IND'] || 0;

  const total = (numDrones * precioDron) + 
                (numBat * precioBat) + 
                (numGen * precioGen) + 
                (numGran * precioGran) + 
                (numBoq * precioBoq);

  const elTotalCombo = document.getElementById('total-combo-monto');
  if (elTotalCombo) {
    elTotalCombo.innerText = `${formatearMXN(total)} MXN`;
  }

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
  const inputDrones = document.getElementById('cantidad-drones');
  const numDrones = inputDrones ? (parseInt(inputDrones.value) || 1) : 1;
  const maxPermitido = numDrones * 6;
  
  let input = document.getElementById('cantidad-baterias');
  if (!input) return;
  let valor = (parseInt(input.value) || 0) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 6 baterías por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function ajustarGeneradores(delta) {
  const inputDrones = document.getElementById('cantidad-drones');
  const numDrones = inputDrones ? (parseInt(inputDrones.value) || 1) : 1;
  const maxPermitido = numDrones * 2;
  
  let input = document.getElementById('cantidad-generadores');
  if (!input) return;
  let valor = (parseInt(input.value) || 0) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 2 generadores por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function ajustarGranulado(delta) {
  const inputDrones = document.getElementById('cantidad-drones');
  const numDrones = inputDrones ? (parseInt(inputDrones.value) || 1) : 1;
  const maxPermitido = numDrones * 1;
  
  let input = document.getElementById('cantidad-granulado');
  if (!input) return;
  let valor = (parseInt(input.value) || 0) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 1 tanque de granulado por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function ajustarBoquillas(delta) {
  const inputDrones = document.getElementById('cantidad-drones');
  const numDrones = inputDrones ? (parseInt(inputDrones.value) || 1) : 1;
  const maxPermitido = numDrones * 1;
  
  let input = document.getElementById('cantidad-boquillas');
  if (!input) return;
  let valor = (parseInt(input.value) || 0) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 1 kit de boquillas por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function agregarDronAlCarrito() {
  if (!productoSeleccionado) {
    alert("Por favor selecciona un modelo de dron antes de agregar al pedido.");
    return;
  }

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? (parseInt(el.value) || 0) : 0;
  };

  const numDrones = getVal('cantidad-drones') || 1;
  const numBat = getVal('cantidad-baterias');
  const numGen = getVal('cantidad-generadores');
  const numGran = getVal('cantidad-granulado');
  const numBoq = getVal('cantidad-boquillas');
  const subtotal = calcularTotalCombo();

  const item = {
    id: productoSeleccionado.id,
    nombre: productoSeleccionado.nombre,
    drones: numDrones,
    baterias: numBat,
    generadores: numGen,
    granulado: numGran,
    boquillas: numBoq,
    subtotal: subtotal
  };

  carrito.push(item);
  actualizarBadge();
  alert(`Se agregó al pedido: ${numDrones}x ${productoSeleccionado.nombre}`);
}

function actualizarBadge() {
  const elBadge = document.getElementById('badge-contador');
  if (elBadge) {
    elBadge.innerText = carrito.length;
  }
}

function abrirModalCarrito() {
  const modal = document.getElementById('modal-carrito');
  const lista = document.getElementById('lista-carrito');
  if (modal) modal.style.display = 'flex';

  if (!lista) return;

  if (carrito.length === 0) {
    lista.innerHTML = '<p>El pedido está vacío.</p>';
    const elTotal = document.getElementById('total-general-monto');
    if (elTotal) elTotal.innerText = "$0.00 MXN";
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

  const elTotal = document.getElementById('total-general-monto');
  if (elTotal) elTotal.innerText = `${formatearMXN(totalGeneral)} MXN`;
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
  const elCliente = document.getElementById('nombre-cliente');
  const cliente = elCliente ? elCliente.value.trim() : '';
  
  if (!cliente) {
    alert("Por favor ingresa el nombre del distribuidor.");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  console.log("Enviando Pedido a Logística:", { cliente, pedido: carrito });
  alert("¡Pedido enviado a Logística exitosamente!");
  carrito = [];
  actualizarBadge();
  cerrarModalCarrito();
}
