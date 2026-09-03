// Guardar la información completa del catálogo desde precios.json
let CATALOGO = {}; 

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch('precios.json');
    if (respuesta.ok) {
      const datos = await respuesta.json();
      datos.forEach(item => {
        if (item.codigo) {
          CATALOGO[item.codigo] = item;
          LISTA_PRECIOS[item.codigo] = parseFloat(item.precio_mxn);
        }
      });
    }
  } catch (error) {
    console.warn("Usando catálogo por defecto.", error);
  }
  actualizarEtiquetasPreciosTarjetas();
});

// Seleccionar producto por su código
function seleccionarProductoPorCodigo(codigo) {
  const producto = CATALOGO[codigo] || {
    codigo: codigo,
    nombre: `DJI Agras ${codigo}`,
    imagen: `img/${codigo.toLowerCase()}.jpg`
  };

  productoSeleccionado = { 
    id: producto.codigo, 
    nombre: producto.nombre, 
    imagen: producto.imagen 
  };
  
  // Actualizar la vista previa
  const elTitulo = document.getElementById('detalle-titulo');
  const elImagen = document.getElementById('detalle-imagen');
  const elControles = document.getElementById('controles-dron');

  if (elTitulo) elTitulo.innerText = producto.nombre;
  if (elImagen) {
    elImagen.src = producto.imagen;
    elImagen.alt = producto.nombre;
  }
  if (elControles) elControles.style.display = 'block';
  
  const inputDrones = document.getElementById('cantidad-drones');
  if (inputDrones) inputDrones.value = 1;

  actualizarLimitesAccesorios(1);
}
