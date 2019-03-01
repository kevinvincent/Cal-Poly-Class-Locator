var Datastore = require('nedb')
const fs = require('fs');
var GeoJSON = require('geojson');

var db = new Datastore({ filename: 'data.js', autoload: true });

db.find({}, function (err, docs) {
   var geojson = GeoJSON.parse(docs.map(x => {
      return {
         name: x.department.trim()+" "+x.courseNumber.trim()+"-"+x.sectionNumber.trim()+": "+x.courseName,
         description: "**Building:** "+x.bldgName+"\n"+
                      "**Room:** "+x.room+"\n"+
                      "**Time:** "+x.time,
         lat: x.lat,
         lng: x.lng
      }
   }), {Point: ['lat', 'lng']});
   fs.writeFileSync('geo.json', JSON.stringify(geojson));
});
 