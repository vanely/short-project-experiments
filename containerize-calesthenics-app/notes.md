Reference Example Docs: https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_API_by_Example 
Overpass Query Wizard: https://overpass-turbo.eu/index.html

| Data Selection         | Spatial Filters       | Output Control     | Meta Filters         | Time Filters        |
|------------------------|------------------------|---------------------|----------------------|---------------------|
| node                   | around                | out                 | newer                | date                |
| way                    | bbox                  | print               | changed              | diff                |
| relation               | poly                  | json                | user                 |                     |
| area                   | pivot                 | csv                 | uid                  |                     |
| .                      | in                    | custom              | type                 |                     |
| >;                     |                       | center              | areaId               |                     |
| <;                     |                       | count               | id                   |                     |
| >>;                    |                       | qt                  | version              |                     |
| <<;                    |                       |                     | changeset            |                     |

| Combinators            | Set Operations        | Regex & Comparison  | Misc                 |
|------------------------|------------------------|---------------------|----------------------|
| union                  | difference            | ~                   | make                 |
| foreach                | if                    | !=                  | convert              |
| complete               |                       | =                   | retro                |
|                        |                       | >                   | nwr                  |
|                        |                       | <                   | br                   |
|                        |                       | >=                  | complete             |
|                        |                       | <=                  |                      |

| Query Structure        | Bounding Box Format   |
|------------------------|------------------------|
| [out:json];            | (s,w,n,e)              |
| [timeout:seconds];     |                        |
| [maxsize:bytes];       |                        |
| [bbox:s,w,n,e];        |                        |




_____________________________________________________________________________________________________________________
Overpass Turbo Query Examples:


1. Basic Data Selection:
[out:json];
(
  node["amenity"="restaurant"];
  way["amenity"="restaurant"];
  relation["amenity"="restaurant"];
);
out;

2. Spatial Filtering:
[out:json];
(
  node["amenity"="school"](around:1000,52.52,13.41);
  way["amenity"="school"](around:1000,52.52,13.41);
);
out;

3. Bounding Box:
[out:json][bbox:52.5,13.3,52.6,13.5];
node["tourism"="hotel"];
out;

4. Output Control:
[out:json];
node["natural"="tree"];
out center;

5. Meta Filters:
[out:json];
(
  node(changed:2019-01-01T00:00:00Z,"2020-01-01T00:00:00Z");
  way(changed:2019-01-01T00:00:00Z,"2020-01-01T00:00:00Z");
);
out meta;

6. Time Filters:
[out:json][date:"2022-01-01T00:00:00Z"];
node["amenity"="cafe"];
out;

7. Combinators (Union):
[out:json];
(
  node["amenity"="restaurant"];
  node["amenity"="cafe"];
);
out;

8. Set Operations (Difference):
[out:json];
(
  area["name"="Berlin"]->.a;
  node["amenity"="restaurant"](area.a);
  - node["cuisine"="italian"](area.a);
);
out;

9. Regex & Comparison:
[out:json];
node["name"~"Alexanderplatz"];
out;

10. Query Structure with Timeout:
[out:json][timeout:60];
way["highway"="primary"];
out geom;

11. Using Combinators (Foreach):
[out:json];
area["name"="Berlin"]->.a;
foreach.a->.b(
  node["amenity"="school"](area.b);
  out;
);

12. Complex Query with Multiple Parameters:
[out:json][timeout:90][bbox:52.5,13.3,52.6,13.5];
(
  way["highway"="residential"]["name"~"Straße"];
  node(w)->.n;
);
(.n; - node(w)["highway"="traffic_signals"];);
out;

13. Using Make and Convert:
[out:json];
area["name"="London"]->.a;
node["amenity"="hospital"](area.a);
make polygon out of node(poly.a);
convert result :: ::geom=geom(),::id=id(),name=name;
out geom;

14. Retro Query:
[out:json];
[date:"2010-01-01T00:00:00Z"];
node(51.5,-0.1,51.6,0.0)(if:timestamp() < timestamp("2010-01-01T00:00:00Z"));
out meta;

15. Using NWR (Nodes, Ways, Relations):
[out:json];
nwr["amenity"="school"]["name"~"International"];
out center;

16. Query with User Filter:
[out:json];
(
  node(user:"OpenStreetMap Username");
  way(user:"OpenStreetMap Username");
);
out meta;

17. Area Query with Pivot:
[out:json];
area["name"="Paris"]->.a;
node(pivot.a);
out;

18. Query with Type and Version Filters:
[out:json];
(
  node["highway"="traffic_signals"](type:node)(version:1);
  way["highway"="primary"](type:way)(version:1);
);
out meta;

19. Changeset Query:
[out:json];
(
  node(changeset:12345678);
  way(changeset:12345678);
);
out meta;

20. Complex Query with Multiple Filters and Operations:
[out:json][timeout:180];
area["name"="Berlin"]->.a;
(
  node["amenity"="restaurant"]["cuisine"="italian"](area.a);
  way["amenity"="restaurant"]["cuisine"="italian"](area.a);
)->.italian_restaurants;
node(around.italian_restaurants:100)["amenity"="parking"];
out center;

