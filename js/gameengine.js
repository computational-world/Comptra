window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
	this.platforms = [];
	this.powerups = [];
	this.monsters = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
	
	for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

/** Create Game Map.*/
GameEngine.prototype.createLevelOneMap = function() {
	
	// Waterfall(game, spritesheet, sourceXWater, sourceYWater, sourceXTopSplash, sourceYTopSplash, sourceXBotSplash, sourceYBotSplash, 
	// x, y, width, height, waterfallWidth, waterfallHeight)
	// waterfall
	this.addEntity(new Waterfall(gameEngine, AM.getAsset("./img/ForestTiles.png"), 318, 679, 490, 679, 490, 716, 
	6650, 300, 50, 50, 16, 6));
	
	// TilePlatform(game, spritesheet, sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles) {
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 0, 500, 50, 50, 18);
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 1000, 500, 50, 50, 3);
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 2300, 200, 50, 50, 18);
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 2150, 300, 50, 50, 6);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 2300, 500, 50, 50, 8);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 2850, 500, 50, 50, 2);
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 1400, 400, 50, 50, 18);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 1250, 500, 50, 50, 9);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 3300, 500, 50, 50, 18);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 4250, 400, 50, 50, 13);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 5000, 400, 50, 50, 13);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 5700, 300, 50, 50, 19);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 6650, 450, 50, 50, 3);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 7300, 450, 50, 50, 3);
	this.createTilePlatform( 23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 6650, 550, 50, 50, 16);

	// water
	this.createTile(318, 788, 50, 50, 0, 600, 200, 2);
	
    // // rocks
	this.createTile(74, 866, 30, 16, 100, 500-16, 1, 1);
	this.createTile(74, 866, 30, 16, 650, 500-16, 1, 1);
	this.createTile( 38, 867, 30, 15, 1500, 400 - 15, 1, 1);
	this.createTile( 38, 867, 30, 15, 2000, 400 - 15, 1, 1);
	this.createTile( 38, 867, 30, 15, 2700, 200 - 15, 1, 1);
	this.createTile( 38, 867, 30, 15, 3500, 500 - 15, 1, 1 );
	this.createTile( 38, 867, 30, 15, 4050, 500 - 15, 1, 1 );
	this.createTile( 38, 867, 30, 15, 4650, 400 - 15, 1, 1 );
	this.createTile( 38, 867, 30, 15, 5550, 400 - 15, 1, 1 );
	this.createTile( 38, 867, 30, 15, 5900, 300 - 15, 1, 1 );
	this.createTile( 38, 867, 30, 15, 6100, 300 - 15, 1, 1 );
	this.createTile( 38, 867, 30, 15, 6550, 300 - 15, 1, 1 );

    // // small trees
	this.createTile( 77, 692, 28, 39, 400, 500 - 39, 1, 1 );
	this.createTile( 77, 692, 28, 39, 1700, 400 - 39, 1, 1 );
	this.createTile( 77, 692, 28, 39, 2400, 200 - 39, 1, 1 );
	this.createTile( 77, 692, 28, 39, 2900, 200 - 39, 1, 1 );
	this.createTile( 77, 692, 28, 39, 4400, 400 - 39, 1, 1 );
	this.createTile( 77, 692, 28, 39, 5200, 400 - 39, 1, 1 );
	this.createTile(77, 692, 28, 39, 6450, 300 - 39, 1, 1);
	
	// // plant 4 (108, 72, 20, 43)
	this.createTile(108, 782, 20, 43, 2600, 500 - 43, 1, 1);
	this.createTile( 108, 782, 20, 43, 3800, 500 - 43, 1, 1 );
	this.createTile( 108, 782, 20, 43, 5400, 400 - 43, 1, 1 );
	this.createTile(108, 782, 20, 43, 6300, 300 - 43, 1, 1);
	
}

/** Create Tile Platform.*/
GameEngine.prototype.createTilePlatform = function(sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
											sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles) {
	var pf = new TilePlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
																					sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles);
	this.addEntity(pf);
	this.platforms.push(pf);
}

/** Create Tiles*/
GameEngine.prototype.createTile = function(sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats) {
	this.addEntity(new Tile(gameEngine, AM.getAsset("./img/ForestTiles.png"), sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats));
}

/** Create Hero.*/
GameEngine.prototype.createHero = function() {
    // //var Hero = new Soldier(gameEngine, AM.getAsset("./img/soldierRight.png"), 6000, 0);
	var Hero = new Soldier(gameEngine, AM.getAsset("./img/soldierRight.png"), 200, 0);
	gameEngine.Hero = Hero;
}

/** Create Power Up.*/
GameEngine.prototype.createPowerUp = function(spritesheet, x, y, width, height, scale, type) {
	var power = new PowerUp(gameEngine, spritesheet, x, y, width, height, scale, type);
    this.addEntity(power);
	this.powerups.push(power);
}

/** Create level 1 monsters.*/
GameEngine.prototype.createLevelOneMonsters = function() {
	
		// Power Ups
	gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/coin.png"), 1050, 500 - (0.07 * 496), 494, 496, 0.07, "coin");
	gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/shield.png"), 2875, 500 - (0.15 * 256), 256, 256, 0.15, "shield");

	// Monsters
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 2150, 350, 50, 50, false, "none");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 2800, 150, 50, 50, false, "none");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 1650, 450, 50, 50, true, "coin");
	this.addMonsters(monster);

	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 3150, 150, 50, 50, true, "coin");
	this.addMonsters(monster);
	
	monster = new Mech(gameEngine, AM.getAsset("./img/mechs.png"), 4000, 500-81, 140, 108, true, "coin");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 4850, 350, 50, 50, false, "none");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 5600, 350, 50, 50, true, "coin");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 6150, 250, 50, 50, false, "none");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 6600, 250, 50, 50, true, "health");
	this.addMonsters(monster);
	
	// Boss 1
	//var Boss = new Boss1(gameEngine, AM.getAsset("./img/mechs.png"), 700, 650-81, 140, 108, true, "coin");
	var Boss = new Boss1(gameEngine, AM.getAsset("./img/mechs.png"), 7350, 550-81, 140, 108, true, "exit");
	this.addMonsters(Boss);
}

/** Load Level One Check Point.*/
GameEngine.prototype.loadLevelOneCheckPoint = function() {
	monster = new Mech(gameEngine, AM.getAsset("./img/mechs.png"), 4000, 500-81, 140, 108, true, "coin");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 4850, 350, 50, 50, false, "none");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 5600, 350, 50, 50, true, "coin");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 6150, 250, 50, 50, false, "none");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 6600, 250, 50, 50, true, "health");
	this.addMonsters(monster);
	
	// Boss 1
	//var Boss = new Boss1(gameEngine, AM.getAsset("./img/mechs.png"), 700, 650-81, 140, 108, true, "coin");
	var Boss = new Boss1(gameEngine, AM.getAsset("./img/mechs.png"), 7350, 550-81, 140, 108, true, "exit");
	this.addMonsters(Boss);
}


/** Add monsters to the world.*/
GameEngine.prototype.addMonsters = function(monster) {
	this.addEntity(monster);
	this.monsters.push(monster);
}

/** Load level 1*/
GameEngine.prototype.loadLevelOne = function() {
	gameEngine.createLevelOneMap();
	
	// Monsters
	gameEngine.createLevelOneMonsters();
	gameEngine.addEntity(gameEngine.Hero);
	soundSong.play();
}

/** Load level 2*/
GameEngine.prototype.loadLevelTwo = function() {
	// gameEngine.addEntity(gameEngine.Hero);
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 0, 500, 50, 50, 18);
	this.createTilePlatform(23, 201, 77, 201, 131, 201, 23, 255, 77, 255, 131, 255, 1000, 500, 50, 50, 3);
	soundSong.play();

}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    return offscreenCanvas;
}