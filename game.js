var pjs = new PointJS('2D', 1280 / 2, 720 / 2, { // 16:9
	backgroundColor : '#53769A' // if need
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

var player = game.newRectObject({
    position : point(500, -100), // central position of text
    fillColor : '#EAEAEA', // color text
    w : 50, h : 50
});
/*game.update = function () {
    // Update function
    game.clear(); // clear screen
};

game.entry = function () {
    // Entry Function
};

game.exit = function () {
    // Exit function
};*/

// Game Loop
game.newLoopFromConstructor('start', function () {
    var a1 = game.newRectObject({
        position : point(500, -100), // central position of text
        fillColor : '#EAEAEA', // color text
        w : 50, h : 50
    });
    var speed = point();
    var maxSpeed = 2;

    var walls = [];
    OOP.fillArr(walls, 100, function () {
        return game.newRectObject({
            position : point(math.random(0, 2000), math.random(0, 2000)),
            fillColor : '#E77373',
            w : math.random(20, 100), h : math.random(30, 100)
        });
    });

    this.update = function () {

        if (key.isDown('A')) {
            a1.moveAngle(1, pjs.vector.getAngle2Points(a1.getPositionC(), mouse.getPosition()) - 90);
        } else if (key.isDown('D')) {
            a1.moveAngle(1, pjs.vector.getAngle2Points(a1.getPositionC(), mouse.getPosition()) + 90);
        }

        if (key.isDown('W'))
            a1.moveToC(mouse.getPosition(), 2);
        else if (key.isDown('S'))
            a1.moveToC(mouse.getPosition(), -1);

        a1.rotateForPoint(mouse.getPosition(), 2);

        game.clear(); // clear screen
        a1.draw();
        OOP.drawArr(walls);
        camera.follow(a1, 20);
    };

});

game.startLoop('start');