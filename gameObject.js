var GameObject = function (properties) {
    this.prototype = game.newBaseObject(properties === undefined ? {} : properties);
    this.__proto__ = this.prototype;

    this.cornerPoints = [];
    this.getCornerPoints = function () {
        return this.cornerPoints;
    };
};

