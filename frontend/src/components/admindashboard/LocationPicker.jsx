import React, { useEffect } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';

export default function LocationPicker({ position, setPosition, center }) {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? (
    <Marker position={{ lat: position[0], lng: position[1] }}>
      <Popup>Selected location: {position[0].toFixed(6)}, {position[1].toFixed(6)}</Popup>
    </Marker>
  ) : null;
}
