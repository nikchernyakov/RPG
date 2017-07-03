var pjs = new PointJS('2D', 1280 / 2, 720 / 2, { // 16:9
	backgroundColor : '#ffffff' // if need
});
pjs.system.initFullPage(); // for Full Page mode

var log    = pjs.system.log;     // log = console.log;
var game   = pjs.game;           // Game Manager
var point  = pjs.vector.point;   // Constructor for Point
var camera = pjs.camera;         // Camera Manager
var brush  = pjs.brush;          // Brush, used for simple drawing
var OOP    = pjs.OOP;            // Object's manager
var math   = pjs.math;           // More Math-methods
var levels = pjs.levels;         // Levels manager

var key   = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();
// var touch = pjs.touchControl.initTouchControl();
// var act   = pjs.actionControl.initActionControl();

var width  = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport

pjs.system.setTitle('RPG.io'); // Set Title for Tab or Window

var gameLocation = createGameLocation();
gameLocation.fillRandomLocation();
var player = createCharacter(gameLocation.getPlayerStartPosition());
// Game Loop
game.newLoopFromConstructor('start', function () {

    var walls = [];
    OOP.fillArr(walls, 100, function () {
        return game.newRectObject({
            position : point(math.random(0, 2000), math.random(0, 2000)),
            fillColor : '#E77373',
            w : math.random(20, 100), h : math.random(30, 100)
        });
    });

    this.update = function () {
        game.clear(); // clear screen
        gameLocation.redrawLocation();
        player.draw();
        player.drawDynamicBox();
        //OOP.drawArr(walls);
        camera.follow(player, 20);

        player.checkMoving(gameLocation.walls);

    };

});

game.startLoop('start');