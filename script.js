let LISTA_PRECIOS = {};
let productoSeleccionado = null;
let carrito = [];

function formatearMXN(monto) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
}

// Cargar precios automáticamente al iniciar la página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch('precios.json');
    const datos = await respuesta.json();
    
    // Mapear los datos por su código para búsqueda rápida
    datos.forEach(item => {
      LISTA_PRECIOS[item.codigo] = item.precio_mxn;
    });

    // Actualizar la vista de las tarjetas con los precios cargados
    if (document.getElementById('precio-tarjeta-T100')) {
      document.getElementById('precio-tarjeta-T100').innerText = `${formatearMXN(LISTA_PRECIOS['T100'] || 0)} MXN`;
      document.getElementById('precio-tarjeta-T70P').innerText = `${formatearMXN(LISTA_PRECIOS['T70P'] || 0)} MXN`;
      document.getElementById('precio-tarjeta-T55').innerText  = `${formatearMXN(LISTA_PRECIOS['T55']  || 0)} MXN`;
      document.getElementById('precio-tarjeta-T25P').innerText = `${formatearMXN(LISTA_PRECIOS['T25P'] || 0)} MXN`;
    }

    console.log("Precios actualizados desde archivo JSON correctamente.");
  } catch (error) {
    console.error("Error al cargar la lista de precios:", error);
  }
});
