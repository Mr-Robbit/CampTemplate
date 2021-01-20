mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [ -103.59179687498357, 40.66995747013945 ],
    zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
    map.addSource('campgrounds', {
        type: 'geojson',
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50 
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: [ 'has', 'point_count' ],
        paint: {
            'circle-color': [
                'step',
                [ 'get', 'point_count' ],
                '#51bbd6',
                5,
                '#f1f075',
                20,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                [ 'get', 'point_count' ],
                20,
                5,
                30,
                20,
                40
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: [ 'has', 'point_count' ],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: [ '!', [ 'has', 'point_count' ] ],
        paint: {
            'circle-color': 'magenta',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
        }
    });

    map.on('click', 'clusters', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [ 'clusters' ]
        });
        const clusterId = features[ 0 ].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[ 0 ].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });
    map.on('click', 'unclustered-point', function (e) {
        const coordinates = e.features[ 0 ].geometry.coordinates.slice();
        const text = e.features[0].properties.popUpMarkup;
        while (Math.abs(e.lngLat.lng - coordinates[ 0 ]) > 180) {
            coordinates[ 0 ] += e.lngLat.lng > coordinates[ 0 ] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                text
            )
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
    map.on('mouseenter', 'unclustered-point', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', function () {
        map.getCanvas().style.cursor = '';
    });
});