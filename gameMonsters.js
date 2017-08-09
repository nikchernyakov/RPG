function getRandomMonsterType() {
    var monsterType = OOP.randArrElement(getMonsterTypes());
    monsterType.monsterClass.fillColor = getRandomMonsterColor();
    return monsterType;
}

function getMonsterTypes() {
    var monsterTypes = [];
    monsterTypes.push(getMonsterType1());
    return monsterTypes;
}

function getMonsterData(monsterClass) {
    var monsterData = game.newTriangleObject({
        w: monsterClass.w, h: monsterClass.h,
        fillColor: monsterClass.fillColor
    });
    monsterData.setUserData(getCreatureProperties());
    return monsterData;
}

function getMonsterType1() {
    return {
        monsterCount : 4,
        monsterClass : {
            w : 50, h: 50,
            speed: 2
        }
    };
}

function getRandomMonsterColor() {
    var monstersColor = [];
    monstersColor.push("#0411ff");
    monstersColor.push("#840059");
    monstersColor.push("#584700");
    return OOP.randArrElement(monstersColor);
}