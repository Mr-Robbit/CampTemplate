mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker()
    .setLngLat([])
    .addTo(map);