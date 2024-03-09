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

const e3857 = JSON.parse(fs.readFileSync("./tokyo-sta-tiles-WebM.geojson")).features;
const e3395 = JSON.parse(fs.readFileSync("./tokyo-sta-tiles-WorldM.geojson")).features;

let res = "";

res += "| タイル座標 | 長さ（Web メルカトル） | 長さ（World メルカトル）| 誤差 |" + "\n";
res += "| :--        | --:                    | --:                     | :--  |" + "\n";

for(let z=18; z > -1; z--){

  const f1 = e3857[z];
  const f2 = e3395[z];
  
  //console.log(f1.properties, f2.properties);
  if(f1.z != f2.z) console.log("ERROR! ZL is not matched.");
  //if(+f1.properties.z < 2) continue;
  
  const d1 = f1.geometry.coordinates[0][1] - f1.geometry.coordinates[1][1];
  const d2 = f2.geometry.coordinates[0][1] - f2.geometry.coordinates[1][1];
  
  res += `|${f1.properties.z}/${f1.properties.x}/${f1.properties.y}|${Math.round(d1)}|${Math.round(d2)}|${Math.round(10000*(d1-d2)/d2)/100}%|` + "\n";
  
}

console.log(res);


