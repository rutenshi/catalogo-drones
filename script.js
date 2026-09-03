let LISTA_PRECIOS = {};
let productoSeleccionado = null;
let carrito = [];

// Formateador oficial a pesos mexicanos (MXN)
function formatearMXN(monto) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
}

// Cargar la lista de precios al inicializar la página desde el JSON
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch('precios.json');
    if (!respuesta.ok) throw new Error("No se pudo cargar precios.json");
    
    const datos = await respuesta.json();
    
    // Mapear el arreglo JSON en un diccionario de fácil acceso por código
    datos.forEach(item => {
      LISTA_PRECIOS[item.codigo] = item.precio_mxn;
    });

    // Actualizar precios en las tarjetas visibles
    actualizarEtiquetasPreciosTarjetas();
    console.log("Precios cargados correctamente desde precios.json:", LISTA_PRECIOS);

  } catch (error) {
    console.error("Error al cargar la lista de precios:", error);
  }
});

function actualizarEtiquetasPreciosTarjetas() {
  const codigos = ['T100', 'T70P', 'T55', 'T25P'];
  codigos.forEach(cod => {
    const el = document.getElementById(`precio-tarjeta-${cod}`);
    if (el) {
      const precio = LISTA_PRECIOS[cod] || 0;
      el.innerText = `${formatearMXN(precio)} MXN`;
    }
  });
}

function seleccionarProducto(id, nombre, imagen) {
  productoSeleccionado = { id, nombre, imagen };
  
  document.getElementById('detalle-titulo').innerText = nombre;
  document.getElementById('detalle-imagen').src = imagen;
  document.getElementById('controles-dron').style.display = 'block';
  
  document.getElementById('cantidad-drones').value = 1;
  actualizarLimitesAccesorios(1);
}

function actualizarLimitesAccesorios(numDrones) {
  const maxBaterias = numDrones * 6;
  const maxGeneradores = numDrones * 2;
  const maxGranulado = numDrones * 1;
  const maxBoquillas = numDrones * 1;

  document.getElementById('max-bat-label').innerText = maxBaterias;
  document.getElementById('max-gen-label').innerText = maxGeneradores;
  document.getElementById('max-gran-label').innerText = maxGranulado;
  document.getElementById('max-boq-label').innerText = maxBoquillas;

  document.getElementById('cantidad-baterias').value = numDrones * 3;
  document.getElementById('cantidad-generadores').value = numDrones * 1;
  document.getElementById('cantidad-granulado').value = 0;
  document.getElementById('cantidad-boquillas').value = 0;

  calcularTotalCombo();
}

function calcularTotalCombo() {
  if (!productoSeleccionado) return 0;

  const numDrones = parseInt(document.getElementById('cantidad-drones').value) || 0;
  const numBat = parseInt(document.getElementById('cantidad-baterias').value) || 0;
  const numGen = parseInt(document.getElementById('cantidad-generadores').value) || 0;
  const numGran = parseInt(document.getElementById('cantidad-granulado').value) || 0;
  const numBoq = parseInt(document.getElementById('cantidad-boquillas').value) || 0;

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

  document.getElementById('total-combo-monto').innerText = `${formatearMXN(total)} MXN`;
  return total;
}

function ajustarDrones(delta) {
  let input = document.getElementById('cantidad-drones');
  let valor = parseInt(input.value) + delta;
  if (valor < 1) valor = 1;
  input.value = valor;
  actualizarLimitesAccesorios(valor);
}

function ajustarBaterias(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const maxPermitido = numDrones * 6;
  let input = document.getElementById('cantidad-baterias');
  let valor = parseInt(input.value) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 6 baterías por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function ajustarGeneradores(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const maxPermitido = numDrones * 2;
  let input = document.getElementById('cantidad-generadores');
  let valor = parseInt(input.value) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 2 generadores por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function ajustarGranulado(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const maxPermitido = numDrones * 1;
  let input = document.getElementById('cantidad-granulado');
  let valor = parseInt(input.value) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 1 tanque de granulado por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function ajustarBoquillas(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const maxPermitido = numDrones * 1;
  let input = document.getElementById('cantidad-boquillas');
  let valor = parseInt(input.value) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo es de 1 kit de boquillas por dron (${maxPermitido} para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  input.value = valor;
  calcularTotalCombo();
}

function agregarDronAlCarrito() {
  if (!productoSeleccionado) return;

  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const numBat = parseInt(document.getElementById('cantidad-baterias').value);
  const numGen = parseInt(document.getElementById('cantidad-generadores').value);
  const numGran = parseInt(document.getElementById('cantidad-granulado').value);
  const numBoq = parseInt(document.getElementById('cantidad-boquillas').value);
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
  alert(`Se agregó al pedido: ${productoSeleccionado.nombre}`);
}

function actualizarBadge() {
  document.getElementById('badge-contador').innerText = carrito.length;
}

function abrirModalCarrito() {
  const modal = document.getElementById('modal-carrito');
  const lista = document.getElementById('lista-carrito');
  modal.style.display = 'flex';

  if (carrito.length === 0) {
    lista.innerHTML = '<p>El pedido está vacío.</p>';
    document.getElementById('total-general-monto').innerText = "$0.00 MXN";
    return;
  }

  let html = '<ul>';
  let totalGeneral = 0;

  carrito.forEach((item) => {
    totalGeneral += item.subtotal;
    html += `<li><b>${item.nombre}</b>: ${item.drones} Equipos | ${item.baterias} Bat. | ${item.generadores} Gen. | ${item.granulado} Gran. | ${item.boquillas} Boq.<br><small>Subtotal: <b>${formatearMXN(item.subtotal)} MXN</b></small></li>`;
  });
  html += '</ul>';
  lista.innerHTML = html;
  document.getElementById('total-general-monto').innerText = `${formatearMXN(totalGeneral)} MXN`;
}

function cerrarModalCarrito() {
  document.getElementById('modal-carrito').style.display = 'none';
}

function enviarPedidoALark() {
  const cliente = document.getElementById('nombre-cliente').value;
  if (!cliente) {
    alert("Por favor ingresa el nombre del distribuidor.");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  console.log("Enviando Pedido a Lark:", { cliente, pedido: carrito });
  alert("¡Pedido enviado a Logística exitosamente!");
  carrito = [];
  actualizarBadge();
  cerrarModalCarrito();
}
