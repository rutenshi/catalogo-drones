let productoSeleccionado = null;
let carrito = [];

function seleccionarProducto(id, nombre, imagen) {
  productoSeleccionado = { id, nombre, imagen };
  
  document.getElementById('detalle-titulo').innerText = nombre;
  document.getElementById('detalle-imagen').src = imagen;
  document.getElementById('controles-dron').style.display = 'block';
  
  // Reiniciar a 1 equipo y calcular los límites de sus accesorios
  document.getElementById('cantidad-drones').value = 1;
  actualizarLimitesAccesorios(1);
}

function actualizarLimitesAccesorios(numDrones) {
  const maxBaterias = numDrones * 6;
  const maxGeneradores = numDrones * 2;
  
  const sugBaterias = numDrones * 3;
  const sugGeneradores = numDrones * 1;

  document.getElementById('max-bat-label').innerText = maxBaterias;
  document.getElementById('max-gen-label').innerText = maxGeneradores;

  document.getElementById('cantidad-baterias').value = sugBaterias;
  document.getElementById('cantidad-generadores').value = sugGeneradores;
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
    alert(`El límite máximo es de 6 baterías por dron (${maxPermitido} baterías para ${numDrones} equipos).`);
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
    alert(`El límite máximo es de 2 generadores por dron (${maxPermitido} generadores para ${numDrones} equipos).`);
    valor = maxPermitido;
  }
  
  input.value = valor;
}

function agregarDronAlCarrito() {
  if (!productoSeleccionado) return;

  const numDrones = parseInt(document.getElementById('cantidad-drones').value);
  const numBat = parseInt(document.getElementById('cantidad-baterias').value);
  const numGen = parseInt(document.getElementById('cantidad-generadores').value);

  const item = {
    nombre: productoSeleccionado.nombre,
    drones: numDrones,
    baterias: numBat,
    generadores: numGen
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
    return;
  }

  let html = '<ul>';
  carrito.forEach((item) => {
    html += `<li><b>${item.nombre}</b>: ${item.drones} Equipos | ${item.baterias} Baterías | ${item.generadores} Generadores</li>`;
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
