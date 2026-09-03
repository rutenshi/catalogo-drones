let productoSeleccionado = null;
let carrito = [];

function seleccionarProducto(id, nombre, imagen) {
  productoSeleccionado = { id, nombre, imagen };
  
  document.getElementById('detalle-titulo').innerText = nombre;
  document.getElementById('detalle-imagen').src = imagen;
  document.getElementById('controles-pedido').style.display = 'block';
  
  document.getElementById('cantidad-drones').value = 1;
  actualizarSugerencias(1);
}

function ajustarCantidad(delta) {
  let input = document.getElementById('cantidad-drones');
  let valor = parseInt(input.value) + delta;
  if (valor < 1) valor = 1;
  input.value = valor;
  actualizarSugerencias(valor);
}

function actualizarSugerencias(cantidad) {
  // Regla de negocio: 3 baterías y 1 generador por dron
  document.getElementById('sug-baterias').innerText = cantidad * 3;
  document.getElementById('sug-generador').innerText = cantidad * 1;
}

function agregarAlCarrito() {
  if (!productoSeleccionado) return;

  const cantidad = parseInt(document.getElementById('cantidad-drones').value);
  
  const item = {
    id: productoSeleccionado.id,
    nombre: productoSeleccionado.nombre,
    cantidad: cantidad,
    baterias: cantidad * 3,
    generadores: cantidad * 1
  };

  carrito.push(item);
  actualizarBadge();
  alert(`${nombre} agregado al pedido.`);
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
    html += `<li><b>${item.nombre}</b> - ${item.cantidad} un. (${item.baterias} Baterías, ${item.generadores} Generadores)</li>`;
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

  // Aquí se conecta con el Webhook de Lark Base
  console.log("Enviando Pedido:", { cliente, pedido: carrito });
  
  alert("¡Pedido enviado a Logística exitosamente!");
  carrito = [];
  actualizarBadge();
  cerrarModalCarrito();
}