var Datastore = require('nedb')
const fs = require('fs');
var GeoJSON = require('geojson');

var db = new Datastore({ filename: 'data.js', autoload: true });

db.find({}, function (err, docs) {
   
   var classrooms = {};
   docs.forEach(function(doc) {
      if(!classrooms[doc.bldgName]) {
         classrooms[doc.bldgName] = {}
      }
      classrooms[doc.bldgName][doc.room] = { lat : doc.lat, lng : doc.lng};
   });
   
   var classroomsData = [];
   Object.keys(classrooms).forEach(function(building) {
      Object.keys(classrooms[building]).forEach(function(room){
         classroomsData.push({
            bldg: building.split("-")[1].trim(),
            bldgName: building.split("-")[0].trim(),
            room: room.trim(),
            roomRef: building.split("-")[1].trim() + room,
            lat: classrooms[building][room].lat,
            lng: classrooms[building][room].lng,
            type: "classrooms"
         })
      })
   });
   
   docs = docs.map(function(doc) {
      doc.type = "sections";
      return doc;
   });
   
   var sectionsGeoJson = GeoJSON.parse(docs, {Point: ['lat', 'lng']});
   fs.writeFileSync('sections.json', JSON.stringify(sectionsGeoJson));
   
   var classroomsGeoJson = GeoJSON.parse(classroomsData, {Point: ['lat', 'lng']});
   fs.writeFileSync('classrooms.json', JSON.stringify(classroomsGeoJson));
   
});
 