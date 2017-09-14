function createCreature(properties) {
    /*var creature = game.newBaseObject({
        positionC: pos
    });
    // creature.setUserData(getCreatureProperties());
    creature.setUserData(new GameCreature());
    return creature;*/
    return new GameCreature(properties);
}

var GameCreature = function(properties) {
    this.prototype = new GameObject(properties);
    this.__proto__ = this.prototype;

    this.health = 1;
    this.setHealth = function (hp) {
        this.health = hp;
    };
    this.increaseHealth = function (hp) {
        this.health += hp;
    };
    this.decreaseHealth = function (hp) {
        this.health -= hp;
    };

    this.level = 1;
    this.exp = 0;
    this.speed = 1;
};

function getCreatureProperties() {
    var creatureProperties = {
            health : 100,
            setHealth : function (hp) {
                this.health = hp;
            },
            increaseHealth : function (hp) {
                this.health += hp;
            },
            decreaseHealth : function (hp) {
                this.health -= hp;
            },

            level: 1,
            exp: 0,
            speed: 1
        };

    return creatureProperties;
}

var GameCharacter = function(posC) {
    var characterProperties = getCharacterProperties(posC);

    this.prototype = game.newImageObject(characterProperties);
    this.prototype.prototype = new GameCreature({});
    this.__proto__ = this.prototype;

    this.tasks = [];
    this.lowSpeed = 1;
    this.highSpeed = 2;

    this.checkMoving = function (obstaclesArray) {
        var speed = 0,
            angle = 0,
            frontBox = game.newRectObject({
                positionC: this.getPositionC(),
                w: this.w - 20, h: this.h - 15,
                angle: this.getAngle() + 90
            });

        if (key.isDown('W')){
            speed = this.highSpeed;
            frontBox.h /= 3;
            frontBox.h *= 2;
        }
        else if (key.isDown('S')) {
            speed = -this.lowSpeed;
            //angle = -180;
            frontBox.h /= 2;
            frontBox.y += this.h / 2;
        }
        else if (key.isDown('A')) {
            speed = this.lowSpeed;
            angle = -90;
            frontBox.w /= 2;
        } else if (key.isDown('D')) {
            speed = this.lowSpeed;
            angle = 90;
            frontBox.w /= 2;
            frontBox.x += this.w / 2;
        }


        frontBox.setPositionC(vector.getPointAngle(frontBox.getPositionC(), this.getPositionC(), this.getAngle() + 90));
        frontBox.drawDynamicBox();

        if(speed !== 0){
            var angle2Points = vector.getAngle2Points(this.getPositionC(), mouse.getPosition()),
                angleWithShift = fixAngle(angle2Points + angle);
            this.moveAngle(speed, angleWithShift);
            var intersectionArray = getIntersectionArray(frontBox, obstaclesArray);
            if(intersectionArray.length > 0){
                this.moveAngle(-speed, angleWithShift);

                if(intersectionArray.length === 1)
                    this.moveAroundCollision(intersectionArray[0], speed / 2, angleWithShift);
            }
        }

        this.rotateForPoint(mouse.getPosition(), 2);
        return speed !== 0;
    };

    this.moveAroundCollision = function (obstacle, speed, angle) {
        var posC = this.getPositionC(),
            // Four corners of obstacle
            obstacleA = obstacle.getPosition(),
            obstacleB = vector.pointPlus(obstacleA, point(obstacle.w, 0)),
            obstacleC = vector.pointPlus(obstacleA, point(0, obstacle.h)),
            obstacleD = vector.pointPlus(obstacleA, point(obstacle.w, obstacle.h)),
            // Points of side which near with character
            point1, point2;

        // Find side
        if(posC.y > obstacleA.y && posC.y < obstacleD.y){
            if(posC.x < obstacleA.x) {
                point1 = obstacleC;
                point2 = obstacleA;
            } else if(posC.x > obstacleD.x){
                point1 = obstacleD;
                point2 = obstacleB;
            }
        } else if(posC.x > obstacleA.x && posC.x < obstacleD.x){
            if(posC.y < obstacleB.y) {
                point1 = obstacleA;
                point2 = obstacleB;
            } else if(posC.y > obstacleC.y){
                point1 = obstacleD;
                point2 = obstacleC;
            }
        }

        // Select direction and move character
        var pointFrom, pointTo;
        if(point1 && point2){
            if(fixAngle(fixAngle(vector.getAngle2Points(posC, point1)) - angle)
                < fixAngle(angle - fixAngle(vector.getAngle2Points(posC, point2)))){
                pointFrom = point2;
                pointTo = point1;
            } else {
                pointFrom = point1;
                pointTo = point2;
            }

            var direction = vector.getAngle2Points(pointFrom, pointTo);
            this.moveAngle(speed, direction);
        }
    };

    this.isEatLoot = function(loot){
        return this.isIntersect(loot);
    };


};

function getCharacterProperties(posC) {
    return {
        positionC: posC,
        w: 100, h: 100,
        getW : function () {
            return this.w;
        },
        getH : function () {
            return this.h;
        },
        file: "imgs/icons/CharacterIcon.png",
        fillColor: "#004080",
        angle: -90,
        box: {
            size: pjs.vector.size(-30, -30),
            offset : point(15, 15)
        }
    }
}

/** https://github.com/nikchernyakov/RPG/wiki/Character */
function createCharacter(posC) {
    var characterProperties = getCharacterProperties();
    /*var character = game.newImageObject({
        positionC: posC,
        file: "imgs/icons/CharacterIcon.png",
        fillColor: "#004080",
        w: characterProperties.getW(), h: characterProperties.getH(),
        angle: -90
    });
    character.setBox(characterProperties.box);
    character.setUserData(getCreatureProperties());
    character.setUserData({
        tasks: [],
        lowSpeed: 1,
        highSpeed: 2,


        checkMoving: function (obstaclesArray) {
            var speed = 0,
                angle = 0,
                frontBox = game.newRectObject({
                    positionC: this.getPositionC(),
                    w: this.w - 20, h: this.h - 15,
                    angle: this.getAngle() + 90
                });

            if (key.isDown('W')){
                speed = this.highSpeed;
                frontBox.h /= 3;
                frontBox.h *= 2;
            }
            else if (key.isDown('S')) {
                speed = -this.lowSpeed;
                //angle = -180;
                frontBox.h /= 2;
                frontBox.y += this.h / 2;
            }
            else if (key.isDown('A')) {
                speed = this.lowSpeed;
                angle = -90;
                frontBox.w /= 2;
            } else if (key.isDown('D')) {
                speed = this.lowSpeed;
                angle = 90;
                frontBox.w /= 2;
                frontBox.x += this.w / 2;
            }


            frontBox.setPositionC(vector.getPointAngle(frontBox.getPositionC(), this.getPositionC(), this.getAngle() + 90));
            frontBox.drawDynamicBox();

            if(speed !== 0){
                var angle2Points = vector.getAngle2Points(this.getPositionC(), mouse.getPosition()),
                    angleWithShift = fixAngle(angle2Points + angle);
                this.moveAngle(speed, angleWithShift);
                var intersectionArray = getIntersectionArray(frontBox, obstaclesArray);
                if(intersectionArray.length > 0){
                    this.moveAngle(-speed, angleWithShift);

                    if(intersectionArray.length === 1)
                        this.moveAroundCollision(intersectionArray[0], speed / 2, angleWithShift);
                }
            }

            this.rotateForPoint(mouse.getPosition(), 2);
            return speed !== 0;
        },

        moveAroundCollision: function (obstacle, speed, angle) {
            var posC = this.getPositionC(),
                // Four corners of obstacle
                obstacleA = obstacle.getPosition(),
                obstacleB = vector.pointPlus(obstacleA, point(obstacle.w, 0)),
                obstacleC = vector.pointPlus(obstacleA, point(0, obstacle.h)),
                obstacleD = vector.pointPlus(obstacleA, point(obstacle.w, obstacle.h)),
                // Points of side which near with character
                point1, point2;

            // Find side
            if(posC.y > obstacleA.y && posC.y < obstacleD.y){
                if(posC.x < obstacleA.x) {
                    point1 = obstacleC;
                    point2 = obstacleA;
                } else if(posC.x > obstacleD.x){
                    point1 = obstacleD;
                    point2 = obstacleB;
                }
            } else if(posC.x > obstacleA.x && posC.x < obstacleD.x){
                if(posC.y < obstacleB.y) {
                    point1 = obstacleA;
                    point2 = obstacleB;
                } else if(posC.y > obstacleC.y){
                    point1 = obstacleD;
                    point2 = obstacleC;
                }
            }

            // Select direction and move character
            var pointFrom, pointTo;
            if(point1 && point2){
                if(fixAngle(fixAngle(vector.getAngle2Points(posC, point1)) - angle)
                    < fixAngle(angle - fixAngle(vector.getAngle2Points(posC, point2)))){
                    pointFrom = point2;
                    pointTo = point1;
                } else {
                    pointFrom = point1;
                    pointTo = point2;
                }

                var direction = vector.getAngle2Points(pointFrom, pointTo);
                this.moveAngle(speed, direction);
            }
        },

        isEatLoot: function(loot){
            return this.isIntersect(loot);
        }
    });
    return character;*/
    return new GameCharacter({
        positionC : posC
    }.positionC);
}
