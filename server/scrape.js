const request = require('request-promise');
const delay = require('delay');
var Datastore = require('nedb')

var db = new Datastore({ filename: 'data.js', autoload: true });

const baseRequest = request.defaults({
   jar: true
})

function extract(s, prefix, suffix) {
	var i = s.indexOf(prefix);
	if (i >= 0) {
		s = s.substring(i + prefix.length);
	}
	else {
		return '';
	}
	if (suffix) {
		i = s.indexOf(suffix);
		if (i >= 0) {
			s = s.substring(0, i);
		}
		else {
		  return '';
		}
	}
	return s;
};

function Meeting(roomId, lat, lng, classNumber, department, courseNumber, courseName, bldgName, room, time, sectionNumber) {
	this.roomId = roomId;
	this.lat = lat;
	this.lng = lng;
	this.classNumber = classNumber;
	this.department = department;
	this.courseNumber = courseNumber;
	this.courseName = courseName;
	this.bldgName = bldgName;
	this.room = room;
	this.time = time;
	this.sectionNumber = sectionNumber;
   this.markerLetter = undefined;
}

const objectify = ( obj, [ k, v ] ) => ( obj[ k ] = v, obj );

(async () => {
   try {

      var classesList = [];

      var response = await baseRequest('https://pass.calpoly.edu/main.html');
      var selectors = JSON.parse(await baseRequest('https://pass.calpoly.edu/getCourseSelectors.json'));

      var depts = selectors["departments"];
      for(const dept of depts) {

         var deptCourses = JSON.parse(await baseRequest('https://pass.calpoly.edu/searchByDept.json?deptId='+dept.id));
         for(const course of deptCourses) {

            await baseRequest('https://pass.calpoly.edu/addCourse.json?courseId='+course.id);
            var courseLocationPage = await baseRequest('https://pass.calpoly.edu/map.html?type=course&courseId='+course.id);

            var start = "$(document).ready(function(){";
            var end = "initialize();";

            var jsString = extract(courseLocationPage, start, end);
            eval(jsString);
 
            for(classData of classesList){
               db.update({classNumber: classData.classNumber}, classData, { upsert: true }, function (err, numAffected, affectedDocuments, upsert) {
                  if(upsert) {
                     console.log("inserted");
                  } else {
                     console.log("updated");
                  }
               });
            }

            classesList = [];

            await delay(100);

         }

         await baseRequest('https://pass.calpoly.edu/removeAllCourses.json'); 
         await delay(5000);

      };

   } catch (e) {
       console.log(e)
   }
})();