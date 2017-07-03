function createLocation() {
    var location = game.newRectObject({
        position: point(0,0),
        fillColor: '#c5c5c5',
        w: 2000, h: 2000
    });

    location.setUserData({

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

            var buildingsCount = math.random(3,5);
            for(var i = 0; i < buildingsCount; i++){
                this.buildings.push(createRandomBuilding(this));
            }

            /*var spawnsCount = math.random(12, 16);
            OOP.forInt(spawnsCount, function () {
                this.spawns.push(createRandomSpawn());
            });*/

        },
        redrawLocation: function () {
            location.draw();
            this.drawAllObjects();
        },

        getPlayerStartPosition: function(){
            return point(2000 - 200, 2000 - 200);
        },

        getPlacesArray: function() {
            return [this.spawns, this.buildings];
        }

    });
    return location;
}

function checkPositionForIntersect(location, pos) {
    var newObj = game.newBaseObject({
            position: pos
        }),
        flag = false;

    OOP.forEach(location.getPlacesArray(), function (place) {
        flag = newObj.isArrIntersect(place);
    });
    return flag;
}

/** Building functions */
function createBuilding(pos, w, h) {
    return game.newRectObject({
        positionC: pos,
        fillColor: "#07ff00",
        alpha: 0.3,
        w: w, h: h
    });
}

function createRandomBuilding(location){
    var buildingW = math.random(400,600),
        buildingH = math.random(400,600),
        buildingPosC = generateRandomPos(location, buildingW, buildingH);

    while(checkPositionForIntersect(location, buildingPosC))
        buildingPosC = generateRandomPos(location, buildingW, buildingH);
    return createBuilding(buildingPosC, buildingW, buildingH);
}

function generateRandomPos(location, objW, objH) {
    return point(math.random(location.borderSize + objW / 2,
            location.w - location.borderSize - objW / 2),
        math.random(location.borderSize + objH / 2,
            location.h - location.borderSize - objH / 2));
}