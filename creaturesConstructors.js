function createCreature(pos) {
    var creature = game.newBaseObject({
        positionC: pos
    });
    creature.setUserData(getCreatureProperties());

    return creature;
}

function getCreatureProperties() {
    return {
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
}

function getCharacterProperties() {
    return {
        w: 100, h: 100,
        getW : function () {
            return this.w;
        },
        getH : function () {
            return this.h;
        }
    }
}

/** https://github.com/nikchernyakov/RPG/wiki/Character */
function createCharacter(pos) {
    var characterProperties = getCharacterProperties();
    var character = game.newImageObject({
        positionC: pos,
        file: "imgs/icons/CharacterIcon.png",
        fillColor: "#004080",
        w: characterProperties.getW(), h: characterProperties.getH(),
        angle: -90
    });
    character.setBox({
        size: pjs.vector.size(-35, -35),
        offset : point(17, 17)
    });
    character.setUserData(getCreatureProperties());
    character.setUserData({

        tasks: [],

        checkMoving: function (obstaclesArray) {
            var speed = 0,
                angle = 0;

            if (key.isDown('W')){
                speed = 2;
            }
            else if (key.isDown('S')) {
                speed = -1;
            }
            else if (key.isDown('A')) {
                speed = 1;
                angle = -90;
            } else if (key.isDown('D')) {
                speed = 1;
                angle = 90;
            }

            if(speed !== 0){
                var angle2Points = pjs.vector.getAngle2Points(this.getPositionC(), mouse.getPosition());
                this.moveAngle(speed, angle2Points + angle);
                var intersection;
                if(intersection = isArrayOfArraysIntersect(this, obstaclesArray)){
                    this.moveAngle(-speed, angle2Points + angle);
                }
            }

            this.rotateForPoint(mouse.getPosition(), 2);
            return speed !== 0;
        },

        isEatLoot: function(loot){
            return this.isIntersect(loot);
        }
    });
    return character;
}
