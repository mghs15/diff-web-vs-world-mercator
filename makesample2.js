const fs = require('fs');



//Reference: Slippy map tilenames
//https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
const lon2tile = (lon,zoom) => { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }

const lat2tile = (lat,zoom) => { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

const lon2tiled = (lon,zoom) => { return ((lon+180)/360*Math.pow(2,zoom)); }

const lat2tiled = (lat,zoom) => { return ((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)); }

const tile2long = (x,z) => {
  return (x/Math.pow(2,z)*360-180);
}

const tile2lat = (y,z) => {
  const n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}


// 東京駅
let x = 232846;
let y = 103226;

const geojson = {
  "type": "FeatureCollection",
  "features": []
};

for(let z=18; z > -1; z--){
  
  const x1 = tile2long(x,z);
  const y1 = tile2lat(y,z);
  const x2 = tile2long(x+1,z);
  const y2 = tile2lat(y+1,z);
  
  
  geojson.features.push({
    "type": "Feature",
    "properties": {
      "z" : z,
      "x" : x,
      "y" : y,
      "x1": x1,
      "y1": y1,
      "x2": x2,
      "y2": y2
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
          [x1, y1]
        ]
      ]
    }
  });
  
  x = x >> 1;
  y = y >> 1;
} 

fs.writeFileSync("tokyo-sta2-tiles.geojson", JSON.stringify(geojson, null, 2) );


