const express = require('express');
const axios = require('axios');
const mapboxgl = require('mapbox-gl');

const app = express();
const port = process.env.PORT || 3333;

// Mapbox access token (replace with your own)
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

app.use(express.json());

app.get('/parks', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    // Query OpenStreetMap's Overpass API for outdoor gyms / calisthenics parks
    const query = `
      [out:json];
      area["name"="${city}"]->.searchArea;
      (
        node["leisure"="fitness_station"](area.searchArea);
        way["leisure"="fitness_station"](area.searchArea);
        relation["leisure"="fitness_station"](area.searchArea);
      );
      out center;
    `;

    const overpassResponse = await axios.post('https://overpass-api.de/api/interpreter', query);
    const parks = overpassResponse.data.elements.map(element => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          element.lon || element.center.lon,
          element.lat || element.center.lat
        ]
      },
      properties: {
        name: element.tags.name || 'Unnamed Park'
      }
    }));

    // Create GeoJSON object
    const geoJson = {
      type: 'FeatureCollection',
      features: parks
    };

    res.json(geoJson);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching park data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
