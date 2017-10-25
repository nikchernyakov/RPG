function createHero(pos, gameClassId){
    var hero = {
        character: new GameCharacter(pos),
        weapon: undefined,
        skills: undefined,

        inExecution: false,
        drawWeaponAnimation: undefined,
        defaultWeaponAnimation: undefined,

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
            this.weapon.setPositionC(vector.pointPlus(this.weapon.getPositionC(),
                pjs.vector.pointMinus(this.character.getPositionC(), prevPos)));

            // Weapon angle move for character
            this.weapon.setPositionC(vector.getPointAngle(this.weapon.getPositionC(),
                this.character.getPositionC(),
                this.character.getAngle() - prevAngle));

            // To set weapon along with character
            this.weapon.setAngle(this.character.getAngle() + 90);

            //this.weapon.setPositionC(pjs.vector.pointMinus(this.character.getPositionC(), point(0, 45)));
        },
        
        checkSkills: function () {
            if (!this.inExecution) {
                if (mouse.isPress('LEFT')) {
                    this.skills[0].executeSkill(this);
                }
            }
        },

        checkLoot: function () {
            var nearestLoot = this.character.getNearest(gameLocation.loots);

            if(nearestLoot !== undefined && this.character.isEatLoot(nearestLoot)){
                OOP.delObject(gameLocation.loots, nearestLoot);
            }
        },

        drawWeapon: function () {
            if(this.inExecution && this.drawWeaponAnimation !== undefined) {
                this.drawWeaponAnimation(this);
            } else {
                this.weapon.drawFrame(0);
            }
        },

        endAnimation: function () {
            this.inExecution = false;
            this.drawWeaponAnimation = this.defaultWeaponAnimation;
        }
    };

    return setGameClassProperties(hero, gameClassId);
}

function setGameClassProperties(hero, gameClassId) {
    var heroProperties;
    switch (gameClassId){
        case getWarriorId():
            heroProperties = getWarriorClassProperties(hero);
            break;
    }
    hero.weapon = heroProperties.weapon;
    hero.skills = heroProperties.skills;
    hero.defaultWeaponAnimation = heroProperties.defaultWeaponAnimation;
    return hero;
}

function getWarriorClassProperties(hero) {
    return {
        weapon: getWarriorWeaponFromAnimationPic(hero.character),
        skills: getWarriorSkills(),
        defaultWeaponAnimation: getWarriorDefaultAnimation()
    }
}

function getWarriorId() {
    return 0;
}

function getWarriorDefaultAnimation() {
    return undefined;
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
        animation: pjs.tiles.newAnimation("imgs/weapons/WarriorWeaponAnimationLine2.png", 270, 190, 21),
        w: 270, h: 190,
        delay: 0.5
    });
    weapon.setUserData({
       frameCount: 21
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
        traceObject: new GameObject(),

        executeAnimation: function (hero) {
            hero.inExecution = true;
            hero.drawWeaponAnimation = this.animation;

        },

        animation: function (hero) {
            hero.weapon.draw();

            if(hero.weapon.frame === hero.weapon.frameCount - 1){
                hero.endAnimation();
                hero.weapon.draw();
            }

        },
        
        executeSkill: function (hero) {
            //this.traceObject.setPositionC();

            this.executeAnimation(hero);

        }

        /*getAnimation: function () {
            return hero.weapon.getAnima
        }*/
    }
}