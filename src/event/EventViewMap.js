import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const EventViewMap = ({ latitude, longitude, zoom = 13 }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [longitude, latitude],
      zoom: zoom,
    });

    markerRef.current = new maplibregl.Marker({ color: "red" })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    return () => mapRef.current?.remove();
  }, [latitude, longitude, zoom]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: 400,
        borderRadius: 8,
        overflow: "hidden",
      }}
    />
  );
};

export default EventViewMap;
