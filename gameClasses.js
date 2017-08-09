function createHero(pos, gameClassId){
    var hero = {
        character: createCharacter(pos),
        weapon: undefined,
        skills: undefined,

        inAnimation: false,
        weaponAnimation: undefined,

        draw: function () {
            this.character.draw();
            this.drawWeapon();
            //this.character.drawDynamicBox();
            //this.weapon.drawDynamicBox();
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

            //this.weapon.setPositionC(pjs.vector.pointMinus(this.character.getPositionC(), point(0, 45)));

        },
        
        checkSkills: function () {
            if (!this.inAnimation && mouse.isPress('LEFT')) {
                this.skills[0].executeAnimation(this);
            }
        },

        checkLoot: function () {
            var nearestLoot = this.character.getNearest(gameLocation.loots);

            if(this.character.isEatLoot(nearestLoot)){
                OOP.delObject(gameLocation.loots, nearestLoot);
            }
        },

        drawWeapon: function () {
            if(this.inAnimation && this.weaponAnimation !== undefined) {
                this.weaponAnimation(this);
            } else {
                this.weapon.drawFrame(0);
            }
        }
    };

    return setGameClassProperties(hero, gameClassId);
}

function setGameClassProperties(hero, gameClassId) {
    switch (gameClassId){
        case getWarriorId():
            hero.weapon = getWarriorWeaponFromAnimationPic(hero.character);
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

function getWarriorWeaponFromAnimationPic(character) {
    var weapon = game.newAnimationObject({
        positionC: pjs.vector.pointMinus(character.getPositionC(), point(0, 45)),
        animation: pjs.tiles.newAnimation("imgs/weapons/WarriorWeaponAnimationLine.png", 270, 190, 12),
        w: 270, h: 190,
        delay: 0.1
    });
    return weapon;
}

function getWarriorSkills() {
    var skills = [];

    skills.push(getWarriorAttackSkill());
    return skills;
}

function getWarriorAttackSkill(){
    return {
        //inAnimation: false,

        executeAnimation: function (hero) {
            hero.inAnimation = true;
            hero.weaponAnimation = this.animation;

            var f = function (hero, bool) {
                hero.inAnimation = bool;
                hero.weapon.drawToFrame(0);
            };

            setTimeout(f, 3000, hero, false);
        },

        animation: function (hero) {
            //hero.weapon.drawReverFrames(0, 11);
            if(hero.weapon.frame !== 11){
                hero.weapon.drawToFrame(11);
            } else {
                hero.weapon.drawFrame(0);
            }
        }
    }
}