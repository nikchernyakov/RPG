function createHero(pos, gameClassId){
    var hero = {
        character: createCharacter(pos),
        weapon: undefined,
        skills: undefined,

        draw: function () {
            this.character.draw();
            this.weapon.draw();
            /*this.character.drawDynamicBox();
            this.weapon.drawDynamicBox();*/
        },

        move: function () {
            var prevAngle = this.character.getAngle();
            var prevPos = this.character.getPositionC();

            // Move character
            this.character.checkMoving(gameLocation.obstacles);

            // Weapon move for character
            this.weapon.setPositionC(pjs.vector.pointPlus(this.weapon.getPositionC(),
                pjs.vector.pointMinus(this.character.getPositionC(), prevPos)));

            // Weapon angle move for character
            this.weapon.setPositionC(pjs.vector.getPointAngle(this.weapon.getPositionC(),
                this.character.getPositionC(),
                this.character.getAngle() - prevAngle));

            // To set weapon along with character
            this.weapon.setAngle(this.character.getAngle() + 90);

        },
        
        checkSkills: function () {
            if (!this.skills[0].inAnimation && mouse.isPress('LEFT')) {
                this.skills[0].executeAnimation(this);
            }
        },

        checkLoot: function () {
            var nearestLoot = this.character.getNearest(gameLocation.loots);

            if(this.character.isEatLoot(nearestLoot)){
                OOP.delObject(gameLocation.loots, nearestLoot);
            }
        }
    };

    return setGameClassProperties(hero, gameClassId);
}

function setGameClassProperties(hero, gameClassId) {
    switch (gameClassId){
        case getWarriorId():
            hero.weapon = getWarriorWeaponFromPic(hero.character);
            hero.skills = getWarriorSkills();
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
        file: "imgs/weapons/sword_pic_1.png",
        fillColor: "#004080",
        w: 35, h: 70
    });
    weapon.setPositionC(pjs.vector.pointPlus(character.getPositionC(), point(character.w/2 + weapon.w/2, 0)));
    return weapon;
}

function getWarriorSkills() {
    var skills = [];

    skills.push(getWarriorAttackSkill());
    return skills;
}

function getWarriorAttackSkill(){
    return {
        inAnimation: false,

        executeAnimation: function (hero) {
            this.inAnimation = true;
            //hero.weapon.circlingC(hero.character.getPositionC(), hero.character.radius, 1);

            var f = function (skill, bool) {
                skill.inAnimation = bool;
            };

            setTimeout(f, 3000, this, false);
        }
    }
}