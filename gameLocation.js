function createGameLocation() {
    var gameLocation = game.newRectObject({
        position: point(0,0),
        fillColor: '#c5c5c5',
        w: 2000, h: 2000
    });

    gameLocation.setUserData({

        borderSize: 50,

        spawns: [],
        loots: [],
        blocks: [],
        buildings: [],
        walls: [],

        drawAllObjects: function () {
            OOP.drawArr(this.walls);
            OOP.drawArr(this.blocks);
            OOP.drawArr(this.spawns);
            OOP.drawArr(this.loots);
            OOP.drawArr(this.buildings);
        },

        fillRandomLocation: function () {
            // Create walls
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(0,0),
                w: this.w, h: this.borderSize
            }));
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(0,0),
                w: this.borderSize, h: this.h
            }));
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(0,2000-50),
                w: this.w, h: this.borderSize
            }));
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(2000-50,0),
                w: this.borderSize, h: this.h
            }));

            var i;

            var spawnsCount = math.random(4, 6);
            for(i = 0; i < spawnsCount; i++) {
                this.spawns.push(createRandomSpawn(this));
            }

            var buildingsCount = math.random(2, 5);
            for(i = 0; i < buildingsCount; i++){
                this.buildings.push(createRandomBuilding(this));
            }

        },
        redrawLocation: function () {
            gameLocation.draw();
            this.drawAllObjects();
        },

        getPlayerStartPosition: function(){
            return point(2000 - 200, 2000 - 200);
        },

        getPlacesArray: function() {
            return [this.spawns, this.buildings];
        }

    });
    return gameLocation;
}

/** Common functions */

function checkPositionForIntersect(gameLocation, pos, objW, objH) {
    var newObj = game.newBaseObject({
            positionC: pos,
            w: objW, h: objH
        }),
        flag = false;

    gameLocation.getPlacesArray().forEach(function (place) {
        flag = newObj.isArrIntersect(place);
        log(flag);
    });
    return flag;
}

function generateRandomPos(gameLocation, objW, objH) {
    return point(math.random(gameLocation.borderSize + objW / 2,
            gameLocation.w - gameLocation.borderSize - objW / 2),
        math.random(gameLocation.borderSize + objH / 2,
            gameLocation.h - gameLocation.borderSize - objH / 2));
}

function findFreePos(gameLocation, objW, objH) {
    var pos = generateRandomPos(gameLocation, objW, objH);

    while(checkPositionForIntersect(gameLocation, pos, objW, objH)) {
        pos = generateRandomPos(gameLocation, objW, objH);
        log("Try again");
    }

    return pos;
}

/** Building functions */
function createBuilding(posC, w, h) {
    return game.newRectObject({
        positionC: posC,
        w: w, h: h,
        fillColor: "#07ff00",
        alpha: 0.3
    });
}

function createRandomBuilding(gameLocation){
    var buildingW = math.random(300, 500),
        buildingH = math.random(300, 500),
        buildingPosC = findFreePos(gameLocation, buildingW, buildingH);

    return createBuilding(buildingPosC, buildingW, buildingH);
}

/** Spawn functions */
function createRandomSpawn(gameLocation) {
    var spawnRadius = math.random(100, 250),
        spawnPosC = findFreePos(gameLocation, spawnRadius * 2, spawnRadius * 2);

    return createSpawn(spawnPosC, spawnRadius);
}

function createSpawn(posC, r) {
    return game.newCircleObject({
        positionC: posC,
        radius: r,
        fillColor: "#ff0600",
        alpha: 0.3
    })
}
