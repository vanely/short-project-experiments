async function getOverpassApiVersion() {
  const apiUrl = "https://overpass-api.de/api/interpreter";
  const query = `
    [out:json];
    out meta;
  `;

  try {
    const response = await fetch(apiUrl, {
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
    // console.log(`JSON Data: ${JSON.stringify(data, null, 2)}`);
    if (data && data.generator) {
      const versionMatch = data.generator.match(/Overpass API (\S+)/);
      console.log(`Version match: ${JSON.stringify(versionMatch, null, 2)}`)
      if (versionMatch && versionMatch[1]) {
        const version = versionMatch[1];
        const majorAndMinor = version.slice(0, 3);
        console.log(`Overpass API version: ${version}`);
        return majorAndMinor;
      }
    }

    console.log("Version information not found in the API response.");
    return null;

  } catch (error) {
    console.error(`An error occurred while fetching the Overpass API version: ${error.message}`);
    return null;
  }
}

// Run the function
getOverpassApiVersion().then(version => {
  if (version) {
    console.log(`Successfully retrieved version: ${version}`);
  } else {
    console.log("Failed to retrieve version.");
  }
});

module.exports = {
  getOverpassApiVersion,
}