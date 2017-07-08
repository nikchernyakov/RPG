function createHero(pos, gameClassId){
    var hero = {
        character: createCharacter(pos),
        weapon: undefined,
        abilities: undefined,

        draw: function () {
            this.character.draw();
            this.weapon.draw();
            this.character.drawDynamicBox();
            this.weapon.drawDynamicBox();
        },

        move: function () {
            var prevAngle = this.character.getAngle();
            var prevPos = this.character.getPositionC();
            if(this.character.checkMoving(gameLocation.obstacles)) {
                this.weapon.setPositionC(pjs.vector.pointPlus(this.weapon.getPositionC(),
                    pjs.vector.pointMinus(this.character.getPositionC(), prevPos)));
            }
            this.weapon.setPositionC(pjs.vector.getPointAngle(this.weapon.getPositionC(),
                this.character.getPositionC(),
                this.character.getAngle() - prevAngle));
            this.weapon.setAngle(this.character.getAngle() + 90);
        }
    };

    return setGameClassProperties(hero, gameClassId);
}

function setGameClassProperties(hero, gameClassId) {
    switch (gameClassId){
        case getWarriorId():
            hero.weapon = getWarriorWeaponFromPic(hero.character);
            break;
    }
    return hero;
}

function getWarriorId() {
    return 0;
}

function getWarriorWeaponFromPic(character){
    var weapon = game.newImageObject({
        position: pjs.vector.pointPlus(character.getPosition(), point(character.w, 0)),
        file: "imgs/weapons/sword_pixel.png",
        fillColor: "#004080",
        w: 35, h: 70
    });
    weapon.setPositionC(pjs.vector.pointPlus(character.getPositionC(), point(character.w/2 + weapon.w/2, 0)));
    return weapon;
}