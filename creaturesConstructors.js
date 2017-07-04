function createCreature(pos) {
    var creature = game.newBaseObject({
        position: pos
    });
    creature.setUserData(getCreature());

    return creature;
}

function getCreature() {
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

/** https://github.com/nikchernyakov/RPG/wiki/Character */
function createCharacter(pos) {
    var character = game.newImageObject({
        position: pos,
        file: "imgs/icons/CharacterIcon.png"
    });
    character.setBox({
        size: pjs.vector.size(-35, -35),
        offset : point(17, 17)
    });
    character.setUserData(getCreature());
    character.setUserData({
        level: 1,
        exp: 0,
        gameClass: undefined,
        tasks: [],
        speed: 1,
        abilities: [],
        weapon: undefined,
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

            flag = false;
            if (key.isDown('W')){
                speed = 2;
                flag = true;

            }
            else if (key.isDown('S')) {
                speed = -1;
                flag = true;
            }
            if(flag){
                var pos = mouse.getPosition();
                this.moveToC(pos, speed);
                if(isArrayOfArraysIntersect(this, arrays)) {
                    this.moveToC(pos, -speed);
                }
            }

            this.rotateForPoint(mouse.getPosition(), 2);
        }
    });
    return character;
}
