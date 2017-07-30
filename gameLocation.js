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

        drawAllObjects: function () {
            OOP.drawArr(this.walls);
            OOP.drawArr(this.blocks);
            OOP.drawArr(this.spawns);
            OOP.drawArr(this.loots);
            this.loots.forEach(function (loot) {
               loot.drawDynamicBox();
            });
                

            OOP.drawArr(this.buildings, function (building) {
                OOP.drawArr(building.walls);
            });
        },

        fillRandomLocation: function () {
            // Create walls
            createWalls(this, getAllSides());

            var i;

            // Create spawns
            var spawnsCount = math.random(4, 6);
            for(i = 0; i < spawnsCount; i++) {
                this.spawns.push(createRandomSpawn(this));
            }

            // Create item
            var lootsCount = math.random(30, 50);
            for(i = 0; i < lootsCount; i++) {
                this.loots.push(createRandomLoot(this));
            }

            // Create buildings
            var buildingsCount = math.random(2, 5);
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
        }

    });
    return gameLocation;
}

/** Common functions */

function isArrayOfArraysIntersect(obj, arrays) {
    var flag = false;
    arrays.forEach(function (array) {
        if(flag !== false) return;
        flag = obj.isArrIntersect(array);
    });

    return flag;
}

function checkPositionForIntersect(pos, objW, objH, obstacles) {
    var newObj = game.newBaseObject({
            positionC: pos,
            w: objW, h: objH
        });

    return isArrayOfArraysIntersect(newObj, obstacles);
}

function generateRandomPosC(gameLocation, objW, objH) {
    return point(math.random(gameLocation.borderSize + objW / 2,
            gameLocation.w - gameLocation.borderSize - objW / 2),
        math.random(gameLocation.borderSize + objH / 2,
            gameLocation.h - gameLocation.borderSize - objH / 2));
}

function findFreePosC(gameLocation, objW, objH, obstacles) {
    var posC = generateRandomPosC(gameLocation, objW, objH);

    while(checkPositionForIntersect(posC, objW, objH, obstacles)) {
        posC = generateRandomPosC(gameLocation, objW, objH);
    }

    return posC;
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
        buildingPosC = findFreePosC(gameLocation, buildingW, buildingH, gameLocation.getPlacesArray());

    return createBuilding(buildingPosC, buildingW, buildingH);
}

/** Spawn functions */
function createRandomSpawn(gameLocation) {
    var spawnRadius = math.random(100, 250),
        spawnPosC = findFreePosC(gameLocation, spawnRadius * 2, spawnRadius * 2, gameLocation.getPlacesArray());

    return createSpawn(spawnPosC, spawnRadius);
}

function createSpawn(posC, r) {
    return game.newCircleObject({
        positionC: posC,
        radius: r,
        fillColor: "#ff0600",
        alpha: 0.2
    })
}

/** Loot functions */
function createRandomLoot(gameLocation) {
    var lootData = getLootData(),
        lootPosC = findFreePosC(gameLocation, lootData.w, lootData.h, gameLocation.obstacles),
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