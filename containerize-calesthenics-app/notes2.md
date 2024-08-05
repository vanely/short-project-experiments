| Keyword          | Description                                                      |
 _____________________________________________________________________________________
| Data Selection   |                                                                  |
|------------------|                                                                  |
| node             | Selects point features (e.g., trees, traffic lights)             |
| way              | Selects linear features (e.g., roads, rivers)                    |
| relation         | Selects complex features (e.g., bus routes, multipolygons)       |
| area             | Selects closed ways or relations representing areas              |
 _____________________________________________________________________________________
| Spacial Filters  |                                                                  |
|------------------|                                                                  |
| around           | Spatial filter for objects within a radius of a point            |
| bbox             | Spatial filter for objects within a bounding box                 |
| poly             | Spatial filter for objects within a polygon                      |
| pivot            | Selects nodes that are part of a way or relation                 |
| in               | Spatial filter for objects within an area                        |
 _____________________________________________________________________________________
| Output Controls  |
|------------------|                                                                  |
| out              | Controls the output format (e.g., json, xml, csv)                |
| print            | Prints the current selection set                                 |
| json             | Specifies JSON output format                                     |
| csv              | Specifies CSV output format                                      |
| center           | Outputs the center point of ways and relations                   |
| count            | Outputs only the count of objects                                |
 _____________________________________________________________________________________
| Meta Filters     |
|------------------|                                                                  |
| newer            | Filters objects modified after a certain date                    |
| changed          | Filters objects changed within a time range                      |
| user             | Filters objects by the username who last edited them             |
| uid              | Filters objects by the user ID who last edited them              |
| type             | Filters objects by their type (node, way, relation)              |
| id               | Filters objects by their OSM ID                                  |
| version          | Filters objects by their version number                          |
| changeset        | Filters objects by the changeset they belong to                  |
 _____________________________________________________________________________________
| Time Filters     |
|------------------|                                                                  |
| date             | Sets a date for historical queries                               |
| diff             | Compares data between two points in time                         |
 _____________________________________________________________________________________
| Combinators      |
|------------------|                                                                  |
| union            | Combines results of multiple queries                             |
| foreach          | Iterates over a set of objects, applying a query to each         |
| complete         | Retrieves all members of relations and all nodes of ways         |
 _____________________________________________________________________________________
|Set Operation     |
|------------------|                                                                  |
| difference       | Removes elements of one set from another                         |
| if               | Conditional statement for filtering                              |
 _____________________________________________________________________________________
|Regex & Comparison|
|------------------|                                                                  |
| make             | Creates new objects based on existing data                       |
| convert          | Transforms objects from one type to another                      |
| retro            | Used in query to pecify a point in time for your data            |
| nwr              | Shorthand for node, way, relation                                |
| br               | Line break in regex, allows matching across multiple lines       |
| complete         | Matches if a tag is present, regardless of its value             |



Common key-value pairs for OSM elements:

Areas:
* admin_level=* (administrative boundary level)
* boundary=administrative (for administrative areas)
* landuse=* (e.g., residential, commercial, forest)
* leisure=* (e.g., park, playground)

Nodes:
* amenity=* (e.g., restaurant, school, hospital)
* shop=* (e.g., supermarket, bakery)
* tourism=* (e.g., hotel, museum, viewpoint)
* natural=* (e.g., tree, peak)
* highway=bus_stop (for bus stops)

Ways:
* highway=* (e.g., motorway, residential, footway)
* waterway=* (e.g., river, stream, canal)
* railway=* (e.g., rail, tram, subway)
* building=* (e.g., yes, house, apartments)
* barrier=* (e.g., fence, wall)

Relations:
* type=route (for routes, e.g., bus routes)
* type=multipolygon (for complex areas)
* route=* (e.g., bus, bicycle, hiking)
* boundary=administrative (for administrative boundaries)
* public_transport=* (e.g., stop_area, network)

General tags (applicable to multiple types):
* name=* (name of the feature)
* addr:* (address information, e.g., addr:street, addr:housenumber)
* opening_hours=* (operating hours for businesses)
* website=* (website URL)
* phone=* (contact phone number)

NOTE: penStreetMap data is community-contributed, so tags can vary and new ones can be introduced over time.