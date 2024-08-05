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