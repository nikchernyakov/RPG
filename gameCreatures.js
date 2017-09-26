var GameCreature = function(pjsObject) {
    inherit(this, pjsObject, GameObject);

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

/** https://github.com/nikchernyakov/RPG/wiki/Character */
var GameCharacter = function(posC) {
    var characterProperties = getCharacterProperties(posC);
    inherit(this, game.newImageObject(characterProperties), GameCreature);

    //this.cornerPoints = getCircleCornerPoints(posC, this.w / 2);
    this.getCornerPoints = function () {
        return getCircleCornerPoints(this.getPositionC(), this.w / 2);
    };
    this.isPointIn = isPointInCircle;

    this.tasks = [];
    this.lowSpeed = 1.5;
    this.highSpeed = 2.5;

    this.checkMoving = function (obstaclesArray) {
        var speed = 0,
            angle = 0;

        if (key.isDown('W')){
            speed = this.highSpeed;
        }
        else if (key.isDown('S')) {
            speed = this.lowSpeed;
            angle = -180;
        }
        else if (key.isDown('A')) {
            speed = this.lowSpeed;
            angle = -90;
        } else if (key.isDown('D')) {
            speed = this.lowSpeed;
            angle = 90;
        }

        if(speed !== 0){
            var angle2Points = fixAngle(vector.getAngle2Points(this.getPositionC(), mouse.getPosition())),
                angleWithShift = fixAngle(angle2Points + angle);
            this.moveAngle(speed, angleWithShift);
            var intersectionArray = getIntersectionArray(this, obstaclesArray);
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
                point1 = obstacleA;
                point2 = obstacleC;
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
        if(point1 && point2){
            var pointFrom, pointTo;
            var v1 = vector.pointMinus(point2, point1),
                v2 = vector.pointMinus(posC, point1);

            // Determine from what side stand point for line (left or right)
            // If left change rotation
            if(v1.x * v2.y - v1.y * v2.x > 0){
                var p = point1;
                point1 = point2;
                point2 = p;
            }


            var lineAngle = fixAngle(fixAngle(vector.getAngle2Points(point1, point2)) + 90),
                angleWithShift = angle,
                reverseAngle = (fixAngle(angle - 180));
            if(lineAngle > 180){
                angleWithShift += 360 * (reverseAngle > angle);
            } else if(lineAngle < 180){
                angleWithShift -= 360 * (reverseAngle < angle);
            }

            if(angleWithShift > lineAngle){
                pointFrom = point2;
                pointTo = point1;
            } else {
                pointFrom = point1;
                pointTo = point2;
            }

            var direction = fixAngle(vector.getAngle2Points(pointFrom, pointTo));
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
