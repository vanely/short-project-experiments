Query attempts to get restaurants in san fran, the last finally works.
TAKE AWAY: it may be best to instead of relying on names of locations, going directly to the locations base on lon/lat coordinates

//[out:json];
//area["ISO3166-1"="US"][admin_level=2]->.country;
//area["name"="California"]["admin_level"=4]
//[boundary="administrative"](area.country)->.state;
//area["name"="San Francisco"]["admin_level"=8]
//[boundary="administrative"](area.state)->.city;
//(
//  node["amenity"="restaurant"](area.city);
//  way["amenity"="restaurant"](area.city);
//  relation["amenity"="restaurant"](area.city);
//);
//out center;

//------------------------------------------
//[out:json];
//area["ISO3166-1"="US"]["admin_level"="2"]->.country;
//area["name"="California"]["admin_level"="4"]
//["is_in:country_code"="US"](area.country)->.state;
//area["name"="San Francisco"]["admin_level"="5"]
//["is_in:state_code"="CA"](area.state)->.city;
//(
//  node["amenity"="restaurant"](area.city);
//  way["amenity"="restaurant"](area.city);
//  relation["amenity"="restaurant"](area.city);
//);
//out center;

//------------------------------------------
[out:json];
(
  node["amenity"="restaurant"]["name"~".*",i](37.7,-122.5,37.8,-122.4);
  way["amenity"="restaurant"]["name"~".*",i](37.7,-122.5,37.8,-122.4);
  relation["amenity"="restaurant"]["name"~".*",i](37.7,-122.5,37.8,-122.4);
);
out center;


Possible variants of outdoor fitness locations as a query
https://wiki.openstreetmap.org/wiki/Tag:leisure=fitness%20station?uselang=en

[out:json];
area["name"="Boston"]->.searchArea;
(
  node["leisure"="fitness_station"](area.searchArea);
  way["leisure"="fitness_station"](area.searchArea);
  relation["leisure"="fitness_station"](area.searchArea);
  
  node["leisure"="fitness_centere"](area.searchArea);
  way["leisure"="fitness_centere"](area.searchArea);
  relation["leisure"="fitness_centere"](area.searchArea);
  
  node["fitness_station"="*"](area.searchArea);
  way["fitness_station"="*"](area.searchArea);
  relation["fitness_station"="*"](area.searchArea);
  
  node["sport"="fitness"](area.searchArea);
  way["sport"="fitness"](area.searchArea);
  relation["sport"="fitness"](area.searchArea);
  
  node["sport"="calisthenics"](area.searchArea);
  way["sport"="calisthenics"](area.searchArea);
  relation["sport"="calisthenics"](area.searchArea);
);
out center;