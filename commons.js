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
    var resultArray = [];
    array.forEach(function (element) {
        if(obj.isIntersect(element))
            resultArray.push(element);
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

function inherit(ChildClass, ParentObject, ParentClass) {
    ChildClass.prototype = ParentObject;
    ChildClass.prototype.prototype = new ParentClass();
    ChildClass.__proto__ = ChildClass.prototype;
}
