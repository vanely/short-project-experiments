import { useEffect, useState } from 'react';
// check on differences between this and arcGIS
import mapboxgl from 'mapbox-gl';

interface MapProps {
  city: 'string';
}

export default function Map({ city }: MapProps) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // will get coordinate data for respective city
    fetch(`/api/locations/${city}`)
    .then(response => response.json())
    .then(data => setLocations(data))
  }, [city]);


}
