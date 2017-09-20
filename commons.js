/** Common functions */

function fixAngle(angle) {
    if(angle < 0){
        angle += 360;
    }
    angle %= 360;
    return angle;
}

function pushArrayInArray(array, elements){
    elements.forEach(function(element){
        array.push(element);
    });
}

function getIntersectionArray(obj, array) {
    var resultArray = [],
        objCornerPoints = obj.getCornerPoints();
    array.forEach(function (element) {
        if(obj.isPointIntersect(objCornerPoints, element)) {
            resultArray.push(element);
        }
    });
    return resultArray;
}

/*function isArrayOfArraysIntersect(obj, arrays) {
 var intersection = false;
 arrays.forEach(function (array) {
 if(intersection !== false) return;
 intersection = obj.isArrIntersect(array);
 });

 return intersection;
 }*/

function inherit(thisChild, pjsObject, ParentClass) {
    thisChild.__proto__ = new ParentClass(pjsObject);
}
