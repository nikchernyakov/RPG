function createCreature(obj) {
    var creature = game.newBaseObject(obj);
    creature.setUserData({
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
    });

    return creature;
}

/** https://github.com/nikchernyakov/RPG/wiki/Character */
function createCharacter(obj) {
    var character = game.newImageObject(obj);
    character.setImage("imgs/icons/CharacterIcon.png");
    character.setBox({
        size: pjs.vector.size(-35, -35),
        offset : point(17, 17)
    });
    character.setUserData(createCreature(obj));
    character.setUserData({
        level: 1,
        exp: 0,
        gameClass: undefined,
        tasks: [],
        speed: 1,
        abilities: [],
        weapon: undefined,
        checkMoving: function (objects) {
            if (key.isDown('A')) {
                this.moveAngle(1, pjs.vector.getAngle2Points(this.getPositionC(), mouse.getPosition()) - 90);
                if(this.isArrIntersect(objects)){
                    this.moveAngle(1, pjs.vector.getAngle2Points(this.getPositionC(), mouse.getPosition()) + 90);
                }
            } else if (key.isDown('D')) {
                this.moveAngle(1, pjs.vector.getAngle2Points(this.getPositionC(), mouse.getPosition()) + 90);
                if(this.isArrIntersect(objects)){
                    this.moveAngle(1, pjs.vector.getAngle2Points(this.getPositionC(), mouse.getPosition()) - 90);
                }
            }

            if (key.isDown('W')){
                this.moveToC(mouse.getPosition(), 2);
                if(this.isArrIntersect(objects)) {
                    this.moveToC(mouse.getPosition(), -2);
                }
            }
            else if (key.isDown('S')) {
                this.moveToC(mouse.getPosition(), -1);
                if (this.isArrIntersect(objects)) {
                    this.moveToC(mouse.getPosition(), 1);
                }
            }

            this.rotateForPoint(mouse.getPosition(), 2);
        }
    });
    return character;
}