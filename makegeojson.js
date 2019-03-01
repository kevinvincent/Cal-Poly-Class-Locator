var Datastore = require('nedb')
const fs = require('fs');
var GeoJSON = require('geojson');

var db = new Datastore({ filename: 'data.js', autoload: true });

db.find({}, function (err, docs) {
   var geojson = GeoJSON.parse(docs, {Point: ['lat', 'lng']});
   fs.writeFileSync('geo.json', JSON.stringify(geojson));
});
 