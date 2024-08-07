"use client"

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

interface Location {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags: {
    name?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    [key: string]: string | undefined;
  };
}

export default function Home() {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);

  useEffect(() => {
    if (mapDiv.current) {
      const map = new Map({
        basemap: 'topo-vector'
      });

      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [-122.4194, 37.7749], // San Francisco coordinates
        zoom: 12
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      setView(view);

      getFitnessLocations().then(locations => {
        plotLocations(locations, graphicsLayer);
      });
    }
  }, []);

  async function getFitnessLocations(): Promise<Location[]> {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json];
      area["name"="San Francisco"]->.searchArea;
      (
        node["leisure"="fitness_centre"](area.searchArea);
        way["leisure"="fitness_centre"](area.searchArea);
        relation["leisure"="fitness_centre"](area.searchArea);
      );
      out center;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.elements as Location[];
    } catch (error) {
      console.error("Error fetching fitness locations:", error);
      return [];
    }
  }

  function plotLocations(locations: Location[], graphicsLayer: GraphicsLayer) {
    locations.forEach(location => {
      const point = {
        type: "point",
        longitude: location.lon || location.center?.lon,
        latitude: location.lat || location.center?.lat
      };

      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
        attributes: location.tags,
        popupTemplate: {
          title: location.tags.name || "Fitness Centre",
          content: [{
            type: "fields",
            fieldInfos: [
              {
                fieldName: "name",
                label: "Name"
              },
              {
                fieldName: "addr:street",
                label: "Street"
              },
              {
                fieldName: "addr:housenumber",
                label: "House Number"
              }
            ]
          }]
        }
      });

      graphicsLayer.add(pointGraphic);
    });
  }

  return (
    <div>
      <Head>
        <title>Fitness Locations Map</title>
        <link rel="stylesheet" href="https://js.arcgis.com/4.24/esri/themes/light/main.css" />
      </Head>

      <main>
        <div ref={mapDiv} style={{ height: '100vh', width: '100vw' }}></div>
      </main>
    </div>
  );
}