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
        }
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
        level: 1,
        exp: 0,
        tasks: [],
        speed: 1,

        checkMoving: function (arrays) {
            var speed = 1,
                angle,
                flag = false;

            if (key.isDown('A')) {
                angle = -90;
                flag = true;
            } else if (key.isDown('D')) {
                angle = 90;
                flag = true;
            }
            if(flag){
                var angle2Points = pjs.vector.getAngle2Points(this.getPositionC(), mouse.getPosition());
                this.moveAngle(speed, angle2Points + angle);
                if(isArrayOfArraysIntersect(this, arrays)){
                    this.moveAngle(speed, angle2Points - angle);
                }
            }

            var flag1 = false;
            if (key.isDown('W')){
                speed = 2;
                flag1 = true;

            }
            else if (key.isDown('S')) {
                speed = -1;
                flag1 = true;
            }
            if(flag1){
                var pos = mouse.getPosition();
                this.moveToC(pos, speed);
                if(isArrayOfArraysIntersect(this, arrays)) {
                    this.moveToC(pos, -speed);
                }
            }

            this.rotateForPoint(mouse.getPosition(), 2);
            return flag || flag1;
        },

        isEatLoot: function(loot){
            return this.isIntersect(loot);
        }
    });
    return character;
}
