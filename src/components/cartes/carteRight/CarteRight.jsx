import React, { useRef, useEffect, useState } from 'react';

import './CarteRight.css';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoianVuaW9yc2ViIiwiYSI6ImNsOWg0Ym9xYjA4aWEzdXI3MTM5anF4a2cifQ._kU_8UjxtM_th_nomnlf1A';
const CarteRight= ()=>{
    
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-4.024429);
    const [lat, setLat] = useState(5.345317);
    const [zoom, setZoom] = useState(11);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
        });
        });

    return (
            <div>
            <div ref={mapContainer} className="map-container" />
            </div>
            );
}

export default CarteRight;