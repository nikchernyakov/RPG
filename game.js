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
var player = createHero(gameLocation.getPlayerStartPosition(), getWarriorId());
// Game Loop
game.newLoopFromConstructor('start', function () {

    this.update = function () {
        game.clear(); // clear screen
        gameLocation.redrawLocation();
        gameLocation.checkSpawns();

        player.draw();
        camera.follow(player.character, 20);

        player.move();
        player.checkSkills();
        player.checkLoot();


    };

});

game.startLoop('start');