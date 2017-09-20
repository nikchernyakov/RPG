var GameObject = function (pjsObject) {
    if(pjsObject !== undefined){
        //this.prototype = pjsObject;
        //this.__proto__ = this.prototype;
        this.__proto__ = pjsObject;
    } else {
        this.__proto__ = game.newBaseObject({});
    }

    this.cornerPoints = [];
    this.getCornerPoints = function () {
        return getRectangleCornerPoints(this.getPositionC(), this.w, this.h);
    };

    this.isPointIntersect = function (thisPoints, obj) {
        var objPoints = obj.getCornerPoints(),
            thisObj = this,
            flag = false;

        thisPoints.forEach(function (point) {
            if(obj.isPointIn(point, objPoints))
                flag = true;
        });

        objPoints.forEach(function (point) {
            if(thisObj.isPointIn(point, thisPoints))
                flag = true;
        });

        return flag;
    };

    this.isPointIn = vector.isPointIn;
};

function getCircleCornerPoints(posC, r) {
    return [
        vector.pointPlus(posC, point(-r, 0)),
        vector.pointPlus(posC, point(0, -r)),
        vector.pointPlus(posC, point(0, r)),
        vector.pointPlus(posC, point(r, 0))
    ];
}

function getRectangleCornerPoints(posC, w, h) {
    w /= 2;
    h /= 2;
    return [
        vector.pointPlus(posC, point(-w, -h)),
        vector.pointPlus(posC, point(w, -h)),
        vector.pointPlus(posC, point(w, h)),
        vector.pointPlus(posC, point(-w, h))
    ];
}

function isPointInCircle(point) {
    var posC = this.getPositionC(),
        r = this.w/2;

    return ((posC.x - point.x)*(posC.x - point.x) + (posC.y - point.y)*(posC.y - point.y)) < r*r;
}
