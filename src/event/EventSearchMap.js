import React, { useState, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const EventSearchMap = ({ onClick, markers = [], highlight }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [lat, setLat] = useState(55);
  const [lng, setLng] = useState(37);
    
  const highlightMarkerRef = useRef(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
    } else {
         navigator.geolocation.getCurrentPosition((position) => {
              setLat(position.coords.latitude);
              setLng(position.coords.longitude);
         }, () => {
         });
    }
}

getLocation();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [lng, lat],
      zoom: 10,
    });

    mapRef.current = map;

    if (onClick) {
      map.on("click", (e) => onClick(e, map));
    }

    return () => map.remove();
  }, [lat, lng]);

  useEffect(() => {
    if (!mapRef.current) return;

    markers.forEach(({ lng, lat, popup }) => {
      const marker = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      if (popup) {
        marker.setPopup(new maplibregl.Popup().setHTML(popup));
      }
    });
  }, [markers]);

  useEffect(() => {
    if (!mapRef.current || !highlight) return;

    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
    }

    highlightMarkerRef.current = new maplibregl.Marker({ color: "red" })
      .setLngLat([highlight.lng, highlight.lat])
      .addTo(mapRef.current);
  }, [highlight]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: 400, borderRadius: 8 }} />
  );
};

export default EventSearchMap;
