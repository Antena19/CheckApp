// Obtener las referencias del DOM/HTML
const ciudadInput = document.getElementById("ciudad");
const obtenerUbicacionBtn = document.getElementById("obtenerUbicacion");
const ubicacionDiv = document.getElementById("ubicacion");

// Función para obtener la geolocalización de la ciudad ingresada
function obtenerUbicacion() {
  const ciudad = ciudadInput.value.trim();
  if (ciudad === "") {
    mostrarError("Por favor ingresa una ciudad");
    return;
  }

  // Utilizar la API de geocodificación de Google Maps para obtener las coordenadas de la ciudad
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: ciudad }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      const latitud = results[0].geometry.location.lat();
      const longitud = results[0].geometry.location.lng();
      mostrarUbicacion(ciudad, latitud, longitud);
    } else {
      mostrarError("No se pudo encontrar la ciudad");
    }
  });
}

// Mostrar el mapa con la ubicación de la ciudad
function mostrarUbicacion(ciudad, latitud, longitud) {
  // Agrega el contenedor de mapa si no está en el HTML
  if (!document.getElementById("map")) {
    const mapContainer = document.createElement("div");
    mapContainer.id = "map";
    mapContainer.style.height = "400px";
    ubicacionDiv.appendChild(mapContainer);
  }

  // Crear el mapa centrado en las coordenadas de la ciudad
  const mapa = new google.maps.Map(document.getElementById("map"), {
    center: { lat: latitud, lng: longitud },
    zoom: 10
  });

  // Agregar un marcador en el mapa con la ubicación de la ciudad
  new google.maps.Marker({
    position: { lat: latitud, lng: longitud },
    map: mapa,
    title: ciudad
  });
}

// Mostrar errores en el HTML
function mostrarError(mensaje) {
  const errorHTML = `
    <div class="alert alert-danger" role="alert">
      ${mensaje}
    </div>
  `;
  ubicacionDiv.innerHTML = errorHTML;
}

// Agregar evento de click al botón de obtener ubicación
if (obtenerUbicacionBtn) {
  obtenerUbicacionBtn.addEventListener("click", obtenerUbicacion);
}

// Función global para inicializar el mapa (puede ser llamada desde Angular)
window.initMap = function(lat, lng) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 10
  });

  new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map
  });
};
