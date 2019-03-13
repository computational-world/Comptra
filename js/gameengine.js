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
	this.movplatforms = [];
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
	
	// Backgrounds (gameEngine, spritesheet, x, y, speed, numberOfRepeats)
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer1.png"), -1535, 0, 3072, 1536, 0.5, 35, 7));
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer2.png"), -1535, -50, 3072, 1536, 0.5, 75, 8));
	
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
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 318, 788, 50, 50, 0, 600, 200, 2);
	
    // // rocks
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 74, 866, 30, 16, 100, 500-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 74, 866, 30, 16, 650, 500-16, 1, 1);
	this.createTile( AM.getAsset("./img/ForestTiles.png"), 38, 867, 30, 15, 1500, 400 - 15, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 2000, 400 - 15, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 2700, 200 - 15, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 3500, 500 - 15, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 4050, 500 - 15, 1, 1 );
	this.createTile( AM.getAsset("./img/ForestTiles.png"), 38, 867, 30, 15, 4650, 400 - 15, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 5550, 400 - 15, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 5900, 300 - 15, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 6100, 300 - 15, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  38, 867, 30, 15, 6550, 300 - 15, 1, 1 );

    // // small trees
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  77, 692, 28, 39, 400, 500 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 77, 692, 28, 39, 1700, 400 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  77, 692, 28, 39, 2400, 200 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  77, 692, 28, 39, 2900, 200 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  77, 692, 28, 39, 4400, 400 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  77, 692, 28, 39, 5200, 400 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 77, 692, 28, 39, 6450, 300 - 39, 1, 1);
	
	// // plant 4 (108, 72, 20, 43)
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 108, 782, 20, 43, 2600, 500 - 43, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  108, 782, 20, 43, 3800, 500 - 43, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"),  108, 782, 20, 43, 5400, 400 - 43, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 108, 782, 20, 43, 6300, 300 - 43, 1, 1);
	
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
GameEngine.prototype.createTile = function(spritesheet, sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats) {
	this.addEntity(new Tile(gameEngine, spritesheet, sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats));
}

/** Create Hero.*/
GameEngine.prototype.createHero = function() {
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
	gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/grenade.png"), 1050, 500 - (0.07 * 512), 512, 512, .07, "grenade");
	gameEngine.createPowerUp(AM.getAsset("./img/hero.png"), 3350, 200 - (0.75 * 50), 50, 50, .75, "1up");
	//gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/jet.png"), 500, 500 - (0.08 * 333), 825, 333, .08, "airstrike");
	//gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/coin.png"), 3350, 200 - (0.07 * 496), 494, 496, 0.07, "coin");
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
	var Boss = new Boss1(gameEngine, AM.getAsset("./img/mechs.png"), 7350, 550-81, 140, 108, true, "exit");
	this.addMonsters(Boss);
	
	//var bat = new Bat(gameEngine, 500, 300, -1);
	//this.addMonsters(bat);
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
	var Boss = new Boss1(gameEngine, AM.getAsset("./img/mechs.png"), 7350, 550-81, 140, 108, 5, true, "exit");
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

GameEngine.prototype.createLevelTwoMonsters = function() {
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 1000, 500, 50, 50, false, "");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 1100, 500, 50, 50, false, "");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 1200, 500, 50, 50, true, "coin");
	this.addMonsters(monster);
	
	monster = new AimTurret(gameEngine, AM.getAsset("./img/enemies.png"), 1600, 300, 47, 30, true, "airstrike");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 2450, 500, 50, 50, true, "health");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 3200, 400, 50, 50, false, "");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 3250, 400, 50, 50, false, "");
	this.addMonsters(monster);
	
	monster = new FlyingRobot(gameEngine, AM.getAsset("./img/robots.png"), 3300, 400, 50, 50, true, "coin");
	this.addMonsters(monster);
	
	monster = new Mech(gameEngine, AM.getAsset("./img/mechs.png"), 3350, 450-81, 140, 108, true, "coin");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 4350, 200, 50, 50, true, "coin");
	this.addMonsters(monster);
	
	monster = new AimTurret(gameEngine, AM.getAsset("./img/enemies.png"), 4800, 550, 47, 30, false, "");
	this.addMonsters(monster);
	
	monster = new AimTurret(gameEngine, AM.getAsset("./img/enemies.png"), 5350, 550, 47, 30, false, "");
	this.addMonsters(monster);
	
	monster = new Mech(gameEngine, AM.getAsset("./img/mechs.png"), 6200, 450-81, 140, 108, true, "coin");
	this.addMonsters(monster);
	
	monster = new Turret(gameEngine, AM.getAsset("./img/robots.png"), 8050, 150, 50, 50, true, "health");
	this.addMonsters(monster);
	
	monster = new AimTurret(gameEngine, AM.getAsset("./img/enemies.png"), 8625, 150, 47, 30, false, "");
	this.addMonsters(monster);
	
	monster = new AimTurret(gameEngine, AM.getAsset("./img/enemies.png"), 9025, 150, 47, 30, false, "");
	this.addMonsters(monster);
	
	monster = new Mech(gameEngine, AM.getAsset("./img/mechs.png"), 9050, 350-81, 140, 108, true, "coin");
	this.addMonsters(monster);
	
	// Boss 2
	var Boss = new Boss2(gameEngine, AM.getAsset("./img/Boss2.png"), 10670, 370, 87, 110, 2, true, "exit");
	this.addMonsters(Boss);
}

/** Load level 2*/
GameEngine.prototype.loadLevelTwo = function() {
	
	// background 
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/L2Background.png"), -200, -180, 928, 792, 1, 50, 25));
	
	// Waterfall(game, spritesheet, sourceXWater, sourceYWater, sourceXTopSplash, sourceYTopSplash, sourceXBotSplash, sourceYBotSplash, 
	// x, y, width, height, waterfallWidth, waterfallHeight)
	// waterfall
	this.addEntity(new Waterfall(gameEngine, AM.getAsset("./img/ForestTiles.png"), 318, 679, 490, 679, 490, 716, 
	10000, 300, 50, 50, 16, 6));
	
	// rock
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 100, 550-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 600, 550-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 1300, 550-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 1650, 350-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 1800, 550-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 3000, 450-16, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 111, 866, 30, 16, 3950, 350-16, 1, 1);
	
	// small tree
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 206, 692, 28, 39, 2750, 450 - 39, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 206, 692, 28, 39, 7550, 200 - 39, 1, 1 );
	
	// large tree 168, 681
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 168, 681, 28, 50, 3800, 350 - 50, 1, 1 );
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 168, 681, 28, 50, 6950, 550 - 50, 1, 1 );
	
	// plant 2
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 187, 802, 20, 23, 950, 550 - 23, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 187, 802, 20, 23, 2200, 550 - 23, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 187, 802, 20, 23, 4250, 250 - 23, 1, 1);
	
	// plant 4
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 235, 782, 20, 43, 1600, 550 - 43, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 235, 782, 20, 43, 2000, 450 - 43, 1, 1);
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 235, 782, 20, 43, 3450, 450 - 43, 1, 1);
	
	// bush
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 242, 716, 30, 15, 5800, 450 - 15, 1, 1);
	
	// blue flower left
	this.createTile(AM.getAsset("./img/woods.png"), 141, 982, 24, 32, 400, 550 - 32, 1, 1);
	this.createTile(AM.getAsset("./img/woods.png"), 141, 982, 24, 32, 6050, 450 - 32, 1, 1);
	this.createTile(AM.getAsset("./img/woods.png"), 141, 982, 24, 32, 6800, 550 - 32, 1, 1);
	this.createTile(AM.getAsset("./img/woods.png"), 141, 982, 24, 32, 7800, 200 - 32, 1, 1);
	
	// yellow flower right
	this.createTile(AM.getAsset("./img/woods.png"), 82, 1030, 24, 32, 1250, 550 - 32, 1, 1);
	this.createTile(AM.getAsset("./img/woods.png"), 82, 1030, 24, 32, 6650, 550 - 32, 1, 1);
	this.createTile(AM.getAsset("./img/woods.png"), 82, 1030, 24, 32, 3250, 450 - 32, 1, 1);
	
	// powerups
	gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/coin.png"), 4950, 150 - (0.07 * 496), 494, 496, 0.07, "coin");
	//gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/coin.png"), 5450, 150 - (0.07 * 496), 494, 496, 0.07, "coin");
	gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/grenade.png"), 5550, 150 - (0.07 * 512), 512, 512, .07, "grenade");	
	gameEngine.createPowerUp(AM.getAsset("./img/PowerUp/grenade.png"), 8250, 150 - (0.07 * 512), 512, 512, .07, "grenade");
	
	//function(sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
											//sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles)
	//TilePlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 3000, 500, 50, 50, 20)
	
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 1500, 350, 50, 50, 5);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 1850, 450, 50, 50, 5);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 0, 550, 50, 50, 50);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 2600, 450, 50, 50, 20);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 3650, 350, 50, 50, 7);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 4050, 250, 50, 50, 7);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 5600, 450, 50, 50, 14);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 6400, 550, 50, 50, 14);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 7400, 200, 50, 50, 14);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 8600, 200, 50, 50, 2);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 9000, 200, 50, 50, 2);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 8200, 350, 50, 50, 20);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 9900, 300, 50, 50, 2);
	this.createTilePlatform(19, 406, 73, 406, 127, 406, 19, 460, 73, 460, 127, 460, 9800, 500, 50, 50, 20);
	
	
	//MovingPlatform(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    //horizontal, direction, moveUnits, x, y, width, height, numberOfTiles)
	pf = new MovingPlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, true, 1, 6, 4450, 250, 50, 50, 4);
	this.addEntity(pf);
	this.platforms.push(pf);
	this.movplatforms.push(pf);
	
	pf = new MovingPlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, true, -1, 6, 5300, 250, 50, 50, 4);
	this.addEntity(pf);
	this.platforms.push(pf);
	this.movplatforms.push(pf);
	
	pf = new MovingPlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, false, 1, 7, 7150, 200, 50, 50, 4);
	this.addEntity(pf);
	this.platforms.push(pf);
	this.movplatforms.push(pf);
	
	pf = new MovingPlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, true, 1, 5, 9250, 350, 50, 50, 4);
	this.addEntity(pf);
	this.platforms.push(pf);
	this.movplatforms.push(pf);
	
	pf = new MovingPlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, false, 1, 6, 10250, 150, 50, 50, 2);
	this.addEntity(pf);
	this.platforms.push(pf);
	this.movplatforms.push(pf);
	
	pf = new MovingPlatform(gameEngine, AM.getAsset("./img/ForestTiles.png"), 19, 406, 73, 406, 127, 406, false, -1, 6, 10450, 450, 50, 50, 2);
	this.addEntity(pf);
	this.platforms.push(pf);
	this.movplatforms.push(pf);
	
	gameEngine.createLevelTwoMonsters();
	
	// water
	this.createTile(AM.getAsset("./img/ForestTiles.png"), 372, 788, 50, 50, 0, 600, 230, 2);
	
	
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