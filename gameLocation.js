function createGameLocation() {
    var gameLocation = game.newRectObject({
        position: point(0,0),
        fillColor: '#c5c5c5',
        w: 2000, h: 2000
    });

    gameLocation.setUserData({

        borderSize: 50,

        spawns: [],
        blocks: [],
        buildings: [],
        walls: [],
        obstacles: [],
        loots: [],

        getWidthWithBorder: function () {
            return this.w - this.borderSize * 2;
        },

        getHeightWithBorder: function () {
            return this.h - this.borderSize * 2
                ;
        },

        drawAllObjects: function () {
            OOP.drawArr(this.walls);
            OOP.drawArr(this.blocks);

            OOP.drawArr(this.buildings, function (building) {
                OOP.drawArr(building.walls);
            });

            OOP.drawArr(this.spawns);

            OOP.drawArr(this.loots);

            OOP.drawArr(this.spawns, function (spawn) {
                OOP.drawArr(spawn.monsters);
            });

        },

        fillRandomLocation: function () {
            // Create walls
            createWalls(this, getAllSides());

            var i;

            // Create spawns
            var spawnsCount = math.random(5, 5);
            for(i = 0; i < spawnsCount; i++) {
                this.spawns.push(createRandomSpawn(this));
            }

            // Create item
            var lootsCount = math.random(40, 50);
            for(i = 0; i < lootsCount; i++) {
                this.loots.push(createRandomLoot(this));
            }

            // Create buildings
            var buildingsCount = math.random(3, 3);
            for(i = 0; i < buildingsCount; i++){
                this.buildings.push(createRandomBuilding(this));
            }

            // Find obstacles
            this.obstacles = this.findAllObstacles();

        },
        redrawLocation: function () {
            gameLocation.draw();
            this.drawAllObjects();
        },

        getPlayerStartPosition: function(){
            return OOP.randArrElement(this.buildings).getPositionC();
        },

        getPlacesArray: function() {
            return [this.spawns, this.buildings];
        },

        findAllObstacles: function () {
            var obstacles = [this.walls];
            this.buildings.forEach(function(building){
               obstacles.push(building.walls);
            });
            return obstacles;
        },

        checkSpawns: function () {
            this.spawns.forEach(function (spawn) {
                if(spawn.monsters.length < spawn.monsterType.monsterCount){
                    spawn.createMonsters(spawn.monsterType.monsterCount - spawn.monsters.length);
                }
            });
        }

    });
    return gameLocation;
}

/** Common functions */

function isArrayOfArraysIntersect(obj, arrays) {
    var intersection = false;
    arrays.forEach(function (array) {
        if(intersection !== false) return;
        intersection = obj.isArrIntersect(array);
    });

    return intersection;
}

function checkPositionForIntersect(posC, objW, objH, obstacles) {
    var newObj = game.newBaseObject({
            positionC: posC,
            w: objW, h: objH
        });

    return isArrayOfArraysIntersect(newObj, obstacles);
}

function generateRandomPosC(posC, rangeX, rangeY, objW, objH) {
    return point(posC.x + math.random(- rangeX / 2  + objW / 2, rangeX / 2 - objW / 2),
        posC.y + math.random(- rangeY / 2 + objH / 2, rangeY / 2 - objH / 2));
}

function findFreePosC(posC, rangeX, rangeY, objW, objH, obstacles) {
    var generatedPosC = generateRandomPosC(posC, rangeX, rangeY, objW, objH);

    while(checkPositionForIntersect(generatedPosC, objW, objH, obstacles)) {
        generatedPosC = generateRandomPosC(posC, rangeX, rangeY, objW, objH);
    }

    return generatedPosC;
}

function getAllSides() {
    return ["d", "r", "u", "l"];
}

function createWalls(obj, sides) {
    if(sides === undefined){
        sides = getAllSides();
        OOP.insertRandArrElement(sides);
    }

    sides.forEach(function (side) {
        switch (side){
            case "d":
                obj.walls.push(createWall(obj.x, obj.y + obj.h - obj.borderSize, obj.w, obj.borderSize));
                break;
            case "r":
                obj.walls.push(createWall(obj.x + obj.w - obj.borderSize, obj.y, obj.borderSize, obj.h));
                break;
            case "u":
                obj.walls.push(createWall(obj.x, obj.y, obj.w, obj.borderSize));
                break;
            case "l":
                obj.walls.push(createWall(obj.x, obj.y, obj.borderSize, obj.h));
                break;
        }
    });
}

function createWall(x, y, w, h) {
    return game.newRectObject({
        fillColor: '#000000',
        position: point(x, y),
        w: w, h: h
    });
}

/** Building functions */
function createBuilding(posC, w, h) {
    var building = game.newRectObject({
        positionC: posC,
        w: w, h: h,
        fillColor: "#07ff00",
        alpha: 0.2
    });
    building.setUserData({
        borderSize: 20,
        walls: []
    });

    createWalls(building);
    return building;
}

function createRandomBuilding(gameLocation){
    var buildingW = math.random(300, 500),
        buildingH = math.random(300, 500),
        buildingPosC = findFreePosC(gameLocation.getPositionC(), gameLocation.getWidthWithBorder(),
            gameLocation.getHeightWithBorder(), buildingW + getCharacterProperties().getW(),
            buildingH + getCharacterProperties().getH(), gameLocation.getPlacesArray());

    return createBuilding(buildingPosC, buildingW, buildingH);
}

/** Spawn functions */
function createRandomSpawn(gameLocation) {
    var spawnRadius = math.random(170, 250),
        spawnPosC = findFreePosC(gameLocation.getPositionC(), gameLocation.getWidthWithBorder(),
            gameLocation.getHeightWithBorder(), spawnRadius * 2, spawnRadius * 2, gameLocation.getPlacesArray());

    return createSpawn(spawnPosC, spawnRadius);
}

function createSpawn(posC, r) {
    var spawn = game.newCircleObject({
        positionC: posC,
        radius: r,
        fillColor: "#ff0600",
        alpha: 0.15
    });

    spawn.setUserData({
        monsters: [],
        monsterType: getRandomMonsterType(),
        createMonsters: function (count) {
            for(var i = 0; i < count; i++){
                this.monsters.push(this.createMonster(this.monsterType.monsterClass));
            }
        },
        createMonster: function (monsterClass) {
            var monster = getMonsterData(monsterClass);
            monster.setPositionC(findFreePosC(this.getPositionC(), this.radius * Math.sqrt(3), this.radius * Math.sqrt(3),
                monster.w, monster.h, [this.monsters]));
            monster.setUserData(monsterClass);
            return monster;
        }
    });

    return spawn;
}

/** Loot functions */
function createRandomLoot(gameLocation) {
    var lootData = getLootData(),
        lootPosC = findFreePosC(gameLocation.getPositionC(), gameLocation.getWidthWithBorder(),
            gameLocation.getHeightWithBorder(), lootData.w, lootData.h, gameLocation.obstacles),
        lootAngle =  math.random(0, 360);

    return createLoot(lootPosC, lootAngle);
}

function getLootData() {
    return {
        w: 40,
        h: 20
    };
}

function createLoot(posC, angle) {
    return game.newImageObject({
        positionC: posC,
        angle: angle,
        file: "imgs/icons/LootIcon.png"
    });
}