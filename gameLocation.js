function createLocation() {
    var location = game.newRectObject({
        position: point(0,0),
        fillColor: '#c5c5c5',
        w: 2000, h: 2000
    });
    location.setUserData({

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
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(0,0),
                w: 2000, h: 50
            }));
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(0,0),
                w: 50, h: 2000
            }));
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(0,2000-50),
                w: 2000, h: 50
            }));
            this.walls.push(game.newRectObject({
                fillColor: '#000000',
                position: point(2000-50,0),
                w: 50, h: 2000
            }));

            /*var spawnsCount = math.random(12, 16);
            OOP.forInt(spawnsCount, function () {
                this.spawns.push(createRandomSpawn());
            });*/


        },
        redrawLocation: function () {
            location.draw();
            this.drawAllObjects();
        },

        getStartPlayerPosition: function(){
            return point(2000 - 200, 2000 - 200);
        }
    });
    return location;
}
