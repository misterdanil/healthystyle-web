import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const EventCreationMap = ({ onLocationSelect }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const [lat, setLat] = useState(55);
  const [lng, setLng] = useState(37);
  const [status, setStatus] = useState(null);

  const getLocation = () => {
       if (!navigator.geolocation) {
            setStatus('');
       } else {
            setStatus('');
            navigator.geolocation.getCurrentPosition((position) => {
                 setStatus(null);
                 console.log('got');
                 setLat(position.coords.latitude);
                 setLng(position.coords.longitude);
            }, () => {
                 setStatus('');
            });
       }
  }

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    getLocation();
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [lng,lat],
      zoom: 10,
    });

    mapRef.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      onLocationSelectRef.current({ latitude: lat, longitude: lng });
    });

    return () => {
      mapRef.current.remove();
    };
  }, [lat, lng]);

  return <div ref={mapContainer} style={{ height: 400, width: '100%' }} />;
};

export default EventCreationMap;
