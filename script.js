let productoSeleccionado = null;
let carrito = [];

function seleccionarProducto(id, nombre, tipo, imagen) {
  productoSeleccionado = { id, nombre, tipo, imagen };
  
  document.getElementById('detalle-titulo').innerText = nombre;
  document.getElementById('detalle-imagen').src = imagen;
  
  if (tipo === 'dron') {
    document.getElementById('controles-dron').style.display = 'block';
    document.getElementById('controles-accesorio').style.display = 'none';
    
    // Resetear a valores base
    document.getElementById('cantidad-drones').value = 1;
    actualizarLimitesAccesorios(1);
  } else {
    document.getElementById('controles-dron').style.display = 'none';
    document.getElementById('controles-accesorio').style.display = 'block';
    document.getElementById('cantidad-piezas-ind').value = 1;
  }
}

// LÓGICA DE LÍMITES DE DRONES Y SUS COMBOS
function actualizarLimitesAccesorios(numDrones) {
  const maxBaterias = numDrones * 6; // Máximo 6 baterías por dron
  const maxGeneradores = numDrones * 2; // Máximo 2 generadores por dron
  
  const sugBaterias = numDrones * 3; // Sugerencia base: 3
  const sugGeneradores = numDrones * 1; // Sugerencia base: 1

  document.getElementById('max-bat-label').innerText = maxBaterias;
  document.getElementById('max-gen-label').innerText = maxGeneradores;

  // Ajustar valores actuales si sobrepasan los nuevos límites
  let inputBat = document.getElementById('cantidad-baterias');
  let inputGen = document.getElementById('cantidad-generadores');

  inputBat.value = sugBaterias;
  inputGen.value = sugGeneradores;
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
  
  if (valor < 1) valor = 1;
  if (valor > maxPermitido) {
    alert(`El límite máximo permitido es de 6 baterías por dron (${maxPermitido} baterías para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  
  input.value = valor;
}

function ajustarGeneradores(delta) {
  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const maxPermitido = numDrones * 2;
  
  let input = document.getElementById('cantidad-generadores');
  let valor = parseInt(input.value) + delta;
  
  if (valor < 0) valor = 0;
  if (valor > maxPermitido) {
    alert(`El límite máximo permitido es de 2 generadores por dron (${maxPermitido} generadores para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  
  input.value = valor;
}

function ajustarPiezaInd(delta) {
  let input = document.getElementById('cantidad-piezas-ind');
  let valor = parseInt(input.value) + delta;
  if (valor < 1) valor = 1;
  input.value = valor;
}

// MANEJO DEL CARRITO
function agregarDronAlCarrito() {
  if (!productoSeleccionado) return;

  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const numBat = parseInt(document.getElementById('cantidad-baterias').value);
  const numGen = parseInt(document.getElementById('cantidad-generadores').value);

  const item = {
    tipo: 'Combo Dron',
    nombre: productoSeleccionado.nombre,
    drones: numDrones,
    baterias: numBat,
    generadores: numGen
  };

  carrito.push(item);
  actualizarBadge();
  alert(`Se agregó al pedido: Combo ${productoSeleccionado.nombre}`);
}

function agregarPiezaIndAlCarrito() {
  if (!productoSeleccionado) return;

  const cantidad = parseInt(document.getElementById('cantidad-piezas-ind').value);

  const item = {
    tipo: 'Pieza Individual',
    nombre: productoSeleccionado.nombre,
    cantidad: cantidad
  };

  carrito.push(item);
  actualizarBadge();
  alert(`Se agregaron ${cantidad} unidad(es) de ${productoSeleccionado.nombre} al pedido.`);
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
    return;
  }

  let html = '<ul>';
  carrito.forEach((item, index) => {
    if (item.tipo === 'Combo Dron') {
      html += `<li><b>${item.nombre}</b>: ${item.drones} Equipos | ${item.baterias} Baterías | ${item.generadores} Generadores</li>`;
    } else {
      html += `<li><b>${item.nombre}</b>: ${item.cantidad} Unidades</li>`;
    }
  });
  html += '</ul>';
  lista.innerHTML = html;
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
