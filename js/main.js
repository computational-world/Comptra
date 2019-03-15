var AM = new AssetManager();
var gameEngine = new GameEngine();
var gameShop;
var gameMenu;
// var database = new Database();
const WINDOW_WIDTH = 800;
const DEBUG = false;

var check_point_x = {
	"level1": 4000
};

var heroCheckPoint = {
	x: 0,
	y: 0,
	cameraX: 0,
	coins: 0,
	score: 0,
	specials: [],
	weapons: [],
	ammoDouble: 0,
	ammoThreeWay: 0,
	airstrikes: 0,
	grenades: 0,
	weaponsIndex: 0,
	specialsIndex: 0
};


function Sound(src) {
    this.sound = document.createElement("audio");
	
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0.7;
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
		this.sound.currentTime = 0;
    }
}

var soundSong = new Sound("audio/track_1.wav");
soundSong.sound.volume = 0.5;
soundSong.sound.loop = true;

var soundShopTheme = new Sound("audio/Shop/theme.mp3");
soundShopTheme.sound.volume = 0.4;

var soundGameOver = new Sound("audio/gameover.mp3");

function dropPowerUp(entity) {
	var type = entity.powerUpType;
	if (type === "loot") type = this.loot();
	
	if (type === "shield") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/shield.png"), entity.x, entity.boundingbox.bottom - 38, 256, 256, 0.15, "loot");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (type === "double") {
		power = new PowerUp(entity.game, AM.getAsset("./img/bullet2.png"), entity.x, entity.boundingbox.bottom - 35, 14, 14, 2.5, "double");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (type === "three-way") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/three-way.png"), entity.x, entity.boundingbox.bottom - 34, 27, 19, 1.8, "three-way");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (type === "health") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/health.png"), entity.x, entity.boundingbox.bottom - 35, 494, 443, 0.08, "health");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (type === "coin") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/coin.png"), entity.x, entity.boundingbox.bottom - 35, 494, 496, 0.07, "coin");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (type === "airstrike") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/jet.png"), entity.x, entity.boundingbox.bottom - (0.08 * 333), 825, 333, .08, "airstrike");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);	
	} else if (type === "exit") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/exit.png"), entity.exitX, entity.exitY, 128, 128, 1, "exit");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
		
	}
}

function loot() {
	var chance = Math.random();
	var loot = "";	
	var valid = false;
	
	while (valid === false) {
		valid = true;
		// health
		if (chance <= .33) {
			loot = "health";
			
			// if full health reroll
			if (gameEngine.Hero.health === gameEngine.Hero.maxHealth) {
				valid = false;
				chance = Math.random();
			}
		// double
		} else if (chance > .33 && chance <= .66) {
			loot = "double";
		// three-way
		} else {
			loot = "three-way";
		}
	}

	return loot;
}
	
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function CustomAnimation(spriteSheet, startX, startY, offset, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
	this.startX = startX;
	this.startY = startY;
	this.offset = offset;
}

CustomAnimation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 this.startX + (xindex * (this.frameWidth + this.offset)), this.startY + yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

CustomAnimation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

CustomAnimation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


var Camera = {
    x: 0,
	lock: false,
	max: 50000,
    width: WINDOW_WIDTH
};

AM.queueDownload("./img/hero.png");
AM.queueDownload("./img/hero2.png");
AM.queueDownload("./img/layer1.png");
AM.queueDownload("./img/layer2.png");
AM.queueDownload("./img/bullet.png");
AM.queueDownload("./img/bullet2.png");
AM.queueDownload("./img/explosions.png");
AM.queueDownload("./img/robots.png");
AM.queueDownload("./img/mechs.png");
AM.queueDownload("./img/heart.png");
AM.queueDownload("./img/weaponBackground.png");
AM.queueDownload("./img/heartEmpty.png");
AM.queueDownload("./img/ForestTiles.png");
AM.queueDownload("./img/dust.png");
AM.queueDownload("./img/shields.png");
AM.queueDownload("./img/explosion.png");
AM.queueDownload("./img/effects.png");
AM.queueDownload("./img/grenadeBoom.png");
AM.queueDownload("./img/pointer.png");
AM.queueDownload("./img/L2Background.png");
AM.queueDownload("./img/enemies.png");
AM.queueDownload("./img/woods.png");
AM.queueDownload("./img/Boss2.png");
AM.queueDownload("./img/flag.png");
AM.queueDownload("./img/bat.png");


// powerups
AM.queueDownload("./img/PowerUp/health.png");
AM.queueDownload("./img/PowerUp/coin.png");
AM.queueDownload("./img/PowerUp/coinIcon.png");
AM.queueDownload("./img/PowerUp/shield.png");
AM.queueDownload("./img/PowerUp/grenade.png");
AM.queueDownload("./img/PowerUp/exit.png");
AM.queueDownload("./img/PowerUp/jet.png");
AM.queueDownload("./img/PowerUp/missile.png");
AM.queueDownload("./img/PowerUp/three-way.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var bullets = [];
	gameEngine.bullets = bullets;
	var bulletsBad = [];
	gameEngine.bulletsBad = bulletsBad;
	
	gameEngine.startGame = false;
	gameEngine.showSetting = false;
	gameEngine.showCredit = false;
	gameEngine.goBack = false;
	gameEngine.restartGame = false;
	gameEngine.gameOver = false;
	gameEngine.checkPoint = false;
	gameEngine.shop = false;
	gameEngine.done = false;
	gameEngine.endLevel = false;
	
	gameEngine.level = 1;
	
	var playButton = new PlayButton(320, 300, 150, 30);
	var settingButton = new SettingButton(320, 340, 150, 30);
	var creditButton = new CreditButton(320, 380, 150, 30);
	var gobackButton = new GoBackButton(350, 400, 100, 30);
	// var playAgainButton = new PlayAgainButton(350, 300, 150, 35);

	var continueButton = new ContinueButton(335, 350, 150, 35);
	
	gameEngine.playButton = playButton;
	gameEngine.settingButton = settingButton;
	gameEngine.creditButton = creditButton;
	gameEngine.gobackButton = gobackButton;
	// gameEngine.playAgainButton = playAgainButton;
	gameEngine.continueButton = continueButton;
	
	
    gameEngine.init(ctx);
    gameEngine.start();
	startInput();
	
	// gameEngine.createLevelOneMap();
	gameEngine.createHero();	
	gameShop = new GameShop(gameEngine, AM.getAsset("./img/pointer.png"));
	gameMenu = new GameMenu(gameEngine, AM.getAsset("./img/pointer.png"));
	gameEngine.addEntity(gameShop);
	gameEngine.addEntity(gameMenu);
	
    
	console.log("All Done!");
});

function loadCheckPoint() {
	Camera.lock = false;
	var hero;
	for (var i = 0; i < gameEngine.entities.length; i++) {
		
		if (gameEngine.entities[i] instanceof Soldier) {
			hero = gameEngine.entities.splice(i, 1)[0];
			continue;
		}
		
		if ( gameEngine.entities[i] instanceof Background
			|| gameEngine.entities[i] instanceof GameMenu
			|| gameEngine.entities[i] instanceof GameShop) continue;
		gameEngine.entities[i].removeFromWorld = true;
	}
	
	if (!gameEngine.checkPoint) {
			gameEngine.monsters.splice(0, gameEngine.monsters.length);
			gameEngine.platforms.splice(0, gameEngine.platforms.length);
			gameEngine.powerups.splice(0, gameEngine.powerups.length);
			Camera.x = heroCheckPoint.cameraX;
			gameEngine.Hero = hero;
			gameEngine.Hero.x = 200;
			gameEngine.Hero.y = 0;
			gameEngine.Hero.falling = true;
			gameEngine.Hero.coins = heroCheckPoint.coins;
			gameEngine.Hero.weaponsIndex = heroCheckPoint.weaponsIndex;
			gameEngine.Hero.specialsIndex = heroCheckPoint.specialsIndex;
			gameEngine.Hero.specials = Array.from(heroCheckPoint.specials);
			gameEngine.Hero.ammoDouble = heroCheckPoint.ammoDouble;
			gameEngine.Hero.ammoThreeWay = heroCheckPoint.ammoThreeWay;
			gameEngine.Hero.weapons = Array.from(heroCheckPoint.weapons);
			gameEngine.Hero.airstrikes = heroCheckPoint.airstrikes;
			gameEngine.Hero.grenades = heroCheckPoint.grenades;
			gameEngine.Hero.score = heroCheckPoint.score;
		if (gameEngine.level === 1) {
			// remove platforms and monsters and reload
			
			gameEngine.loadLevelOne();
			
			// alert(gameEngine.Hero.specials.length);
		} else if (gameEngine.level === 2) {
			// load check point for level two
			
			gameEngine.loadLevelTwo();
			gameEngine.addEntity(gameEngine.Hero);
		}
	} else {
			hero.x = heroCheckPoint.x;
			hero.y = 0;
			hero.coins = heroCheckPoint.coins;
			hero.specials =  Array.from(heroCheckPoint.specials);
			hero.airstrikes = heroCheckPoint.airstrikes;
			hero.grenades =heroCheckPoint.grenades;
			hero.score = heroCheckPoint.score; 
			hero.ammoDouble = heroCheckPoint.ammoDouble;
			hero.ammoThreeWay = heroCheckPoint.ammoThreeWay;
			hero.weapons = Array.from(heroCheckPoint.weapons);
			hero.falling = true;
			Camera.x = heroCheckPoint.cameraX;
			
		
		if (gameEngine.level === 1) {
		
			gameEngine.createLevelOneMap();
			gameEngine.loadLevelOneCheckPoint();
			
		} else if (this.gameEngine.level === 2) {
		
			gameEngine.createLevelTwoMap();
			gameEngine.loadLevelTwoCheckPoint();
		}
		gameEngine.Hero = hero;
		gameEngine.addEntity(gameEngine.Hero);
	}
	
	alert("Loading CheckPoint");
	
}



function startGame() {
	// set Camera max for lock
	if (gameEngine.level === 1) Camera.max = 7400;
	else if (gameEngine.level === 2) {
		Camera.max = 10750;
		soundSong.play();
	}
	
	Camera.lock = false;
	if (gameEngine.level === 1) {

		gameEngine.loadLevelOne();
	} else {
		
		saveHeroData()
		for (var i = 0; i < gameEngine.entities.length; i++) {
			var entity = gameEngine.entities[i];
			if (entity instanceof Soldier || 
				entity instanceof GameMenu ||
				entity instanceof GameShop) {
					continue;
			}
			gameEngine.entities.splice(i, 1);
		}
			
		gameEngine.loadLevelTwo();
		var hero;
		var hasHero = false;
		for (var i = 0; i < gameEngine.entities.length; i++) {
			var entity = gameEngine.entities[i];
			if (entity instanceof Soldier) {
				hero = gameEngine.entities.splice(i, 1)[0];
				hasHero = true;
				break;
			}
		}
		if (hasHero) {
			gameEngine.Hero = hero;
			gameEngine.addEntity(gameEngine.Hero);
		} else gameEngine.addEntity(gameEngine.Hero);
	}
	

}


function saveHeroData() {
	heroCheckPoint.x = gameEngine.Hero.x;
	heroCheckPoint.y = gameEngine.Hero.y;
	heroCheckPoint.cameraX = Camera.x;
	heroCheckPoint.coins = gameEngine.coins;
	heroCheckPoint.score = gameEngine.score;
	heroCheckPoint.specials = Array.from(gameEngine.Hero.specials);
	heroCheckPoint.airstrikes = gameEngine.Hero.airstrikes;
	heroCheckPoint.grenades = gameEngine.Hero.grenades;
	heroCheckPoint.weapons = Array.from(gameEngine.Hero.weapons);
	heroCheckPoint.ammoDouble = gameEngine.Hero.ammoDouble;
	heroCheckPoint.ammoThreeWay = gameEngine.Hero.ammoThreeWay;
}

function resetGame() {
	// alert(gameEngine.shop + " "  + gameEngine.endLevel + " "  + gameEngine.gameOver);
	if (!gameEngine.shop && !gameEngine.gameOver && !gameEngine.endLevel) {
		gameEngine.Hero.reset();
		Camera.x = 0;
	} else if (gameEngine.gameOver) {
		gameEngine.createHero();
		
	} else if (gameEngine.endLevel) {
		gameEngine.Hero.x = 200;
		gameEngine.Hero.y = 0;
		gameEngine.checkPoint = false;
		gameEngine.Hero.falling = true;
		Camera.x = 0;
	}

	
	gameEngine.monsters.splice(0, gameEngine.monsters.length);
	gameEngine.platforms.splice(0, gameEngine.platforms.length);
	gameEngine.bulletsBad.splice(0, gameEngine.bulletsBad.length);
			
	
	for (var i = 0; i < gameEngine.entities.length; i++) {
		var entity = gameEngine.entities[i];
		if (entity instanceof Soldier || 
			entity instanceof GameMenu ||
			entity instanceof GameShop) {
				continue;
		}
		// entity.removeFromWorld = true;
		gameEngine.entities[i].removeFromWorld = true;
	}
	
}

function resetHeroCheckPoint() {
	heroCheckPoint.x = 200;
	heroCheckPoint.y = 0;
	heroCheckPoint.cameraX = 0;
	heroCheckPoint.coins =  gameEngine.Hero.coins;
	heroCheckPoint.score = gameEngine.Hero.score;
	heroCheckPoint.specials =  gameEngine.Hero.specials;
	heroCheckPoint.airstrikes =  gameEngine.Hero.airstrikes;
	heroCheckPoint.grenades =  gameEngine.Hero.grenades;
	
}

function nextLevel() {
	gameEngine.checkPoint = false;
	gameEngine.Hero.visible = true;
	resetGame();
	gameEngine.shop = false;
	gameEngine.endLevel = false;
	soundShopTheme.stop();
	startGame();
}

function startInput() {
	
	// buttons' events to start game, show settings, and credits
	gameEngine.ctx.canvas.addEventListener("click", function(event) {
		
		var rect = gameEngine.ctx.canvas.getBoundingClientRect();
		var pos = {x : event.clientX - rect.left, y : event.clientY - rect.top};
		if ((!gameEngine.startGame || gameEngine.gameOver) && !gameEngine.showSetting && !gameEngine.showCredit) {
			if (gameEngine.playButton.isClick(pos) && !gameEngine.gameOver) {
				startGame();
				gameEngine.startGame = true;
				gameEngine.showSetting = false;
				gameEngine.showCredit = false;
			}  else if (gameEngine.playButton.isClick(pos) && gameEngine.gameOver) {
				Camera.x = 0;
				gameEngine.startGame = true;
				resetGame();
				gameEngine.gameOver = false;
				startGame();
			}
		} 
		
		if ( !gameEngine.showCredit && gameEngine.settingButton.isClick(pos)) {
				
				gameEngine.showSetting = true;
				gameMenu.pointerY = 280;
				gameMenu.pointerX = 100;
				gameMenu.basey = gameMenu.pointerY;
		}
		
				
		if ( gameEngine.creditButton.isClick(pos)) {
			gameEngine.showCredit = true;
			gameMenu.pointerY = 280;
			gameMenu.pointerX = 100;
			gameMenu.basey = gameMenu.pointerY;
		}
		
		if (gameEngine.gobackButton.isClick(pos)) {
			gameEngine.showSetting = false;
			gameEngine.startGame = false;
			gameEngine.showCredit = false;
			gameMenu.resetPointerPos();
		}
	
		// if (gameEngine.gameOver && gameEngine.playAgainButton.isClick(pos)) {
			// // gameEngine.restartGame = true;
			// Camera.x = 0;
			// gameEngine.startGame = true;
			// resetGame();
			// gameEngine.gameOver = false;
			// startGame();
		// }
		
		if (gameEngine.shop && gameEngine.continueButton.isClick(pos)) {
			gameShop.pointerY = gameShop.boundedTop;
			// saveHeroData();
			nextLevel();
		}
		
		
	}, false);
	
	
	
	
	// Key Listener
    document.addEventListener('keydown', function(e){

		// e.preventDefault();
		if (gameEngine.shop) {
			switch(e.keyCode) {
				// Down
				case 40:
					gameShop.moveDown = true;

					break;
				case 38: // up
					gameShop.moveUp = true;
					break;
				case 13: // purchase item
					
					gameShop.purchaseItem();
					
						
					break;
			}
			
		} else if ((!gameEngine.startGame || gameEngine.gameOver) && !gameEngine.showSetting && !gameEngine.showCredit) {
			// alert("hi");
			switch(e.keyCode) {
				// Down
				case 40:
					gameMenu.moveDown = true;
					break;
				case 38: // up
					gameMenu.moveUp = true;
					break;
				case 13: // purchase item
					
					gameMenu.select();
					
						
					break;
			}
		} else if (gameEngine.showSetting || gameEngine.showCredit) {
			switch(e.keyCode) {
				case 13: // purchase item
					
					gameMenu.select();
						
					break;
			}
		} else {
			switch(e.keyCode) {
			// Spacebar
			case 32:
			    gameEngine.Hero.space = true;
			    break;
                       
            // Left
            case 37:
                gameEngine.Hero.moving = true;
                gameEngine.Hero.direction = -1;          
				break;
             
            // Up
            case 38:
                gameEngine.Hero.up = true;
				break;
             
            // Right
            case 39:
                gameEngine.Hero.moving = true;
                gameEngine.Hero.direction = 1;
                break;
				
			// Down
            case 40:
                gameEngine.Hero.down = true;
                break;
				
			// X
            case 88:
                gameEngine.Hero.jump = true;
                break;
				
			// C
            case 67:
                gameEngine.Hero.shoot = true;
                break;
				
			// Z
            case 90:
                gameEngine.Hero.special = true;
                break;
			// case 83: // S
				// if (!gameEngine.startGame) {
					// gameEngine.startGame = true;
					// startGame();
				// }
				// break;
			}
		}
		
      });
	document.addEventListener('keyup', function(e){
		
		// e.preventDefault();
		switch (e.keyCode) {
		    // space
		    case 32:
		        gameEngine.Hero.space = false;
		        break;

			// left
			case 37:
			    gameEngine.Hero.moving = false;
			    break;
			
			// right
			case 39:
			    gameEngine.Hero.moving = false;
			    break;
			
			//up
			case 38:
			    gameEngine.Hero.up = false;
			    break;
				
			//down
			case 40:
			    gameEngine.Hero.down = false;
			    break;
				
			// X
            case 88:
                gameEngine.Hero.jump = false;
                break;
				
			// C
            case 67:
                gameEngine.Hero.shoot = false;
                break;
				
			// Z
            case 90:
                gameEngine.Hero.special = false;
                break;
				
			// A
            case 65:
				if (gameEngine.Hero.specials.length > 0) {
					if (gameEngine.Hero.specialsIndex + 2 > gameEngine.Hero.specials.length) {
						gameEngine.Hero.currentSpecial = gameEngine.Hero.specials[0];
						gameEngine.Hero.specialsIndex = 0;
					}
					else {
						gameEngine.Hero.currentSpecial = gameEngine.Hero.specials[gameEngine.Hero.specialsIndex+1];
						gameEngine.Hero.specialsIndex++;
					}
				}
                break;
				
			// S
            case 68:
				if (gameEngine.Hero.weaponsIndex + 2 > gameEngine.Hero.weapons.length) {
					gameEngine.Hero.weapon = gameEngine.Hero.weapons[0];
					gameEngine.Hero.weaponsIndex = 0;
				}
				else {
					gameEngine.Hero.weapon = gameEngine.Hero.weapons[gameEngine.Hero.weaponsIndex+1];
					gameEngine.Hero.weaponsIndex++;
				}
				
                break;
				
			// Right shift, cheat code: kill on-screen
			case 16:
				for (var i = 0; i < gameEngine.monsters.length; i++) {
					var monster = gameEngine.monsters[i];
					if (monster.x >= Camera.x && monster.x <= Camera.x + 800) monster.hitPoints -= 100;
				}
				break;

			// "/" cheat code: warp
			case 190:
				if (gameEngine.level === 1) {
					gameEngine.Hero.x = 6500;
					gameEngine.Hero.y = 200;
					Camera.x = 6100;
				} else if (gameEngine.level === 2) {
					gameEngine.Hero.x = 10000;
					gameEngine.Hero.y = 100;

					Camera.x = 9600;
				}
				gameEngine.Hero.falling = true;
				
				break;
		}
	});
}
