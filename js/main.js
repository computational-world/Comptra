var AM = new AssetManager();
var gameEngine = new GameEngine();
var gameShop;
var gameMenu;
// var database = new Database();
const WINDOW_WIDTH = 800;
const DEBUG = false;

var heroCheckPoint = {
	x: 0,
	y: 0,
	cameraX: 0,
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
    }
}

var soundSong = new Sound("audio/track_1.wav");
soundSong.sound.volume = 0.5;

function dropPowerUp(entity) {
	if (entity.powerUpType === "shield") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/shield.png"), entity.x, entity.boundingbox.bottom - 38, 256, 256, 0.15, "shield");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (entity.powerUpType === "health") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/health.png"), entity.x, entity.boundingbox.bottom - 35, 494, 443, 0.08, "health");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (entity.powerUpType === "coin") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/coin.png"), entity.x, entity.boundingbox.bottom - 35, 494, 496, 0.07, "coin");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	} else if (entity.powerUpType === "exit") {
		power = new PowerUp(entity.game, AM.getAsset("./img/PowerUp/exit.png"), entity.x, entity.boundingbox.bottom - 111, 128, 128, 1, "exit");
		entity.game.addEntity(power);
		entity.game.powerups.push(power);
	}
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
	//x: 5600,
	lock: false,
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

// powerups
AM.queueDownload("./img/PowerUp/health.png");
AM.queueDownload("./img/PowerUp/coin.png");
AM.queueDownload("./img/PowerUp/coinIcon.png");
AM.queueDownload("./img/PowerUp/shield.png");
AM.queueDownload("./img/PowerUp/grenade.png");
AM.queueDownload("./img/PowerUp/exit.png");
AM.queueDownload("./img/PowerUp/jet.png");
AM.queueDownload("./img/PowerUp/missile.png");


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
	var playAgainButton = new PlayAgainButton(350, 300, 150, 35);
	var continueButton = new ContinueButton(335, 575, 150, 35);
	
	gameEngine.playButton = playButton;
	gameEngine.settingButton = settingButton;
	gameEngine.creditButton = creditButton;
	gameEngine.gobackButton = gobackButton;
	gameEngine.playAgainButton = playAgainButton;
	gameEngine.continueButton = continueButton;
	
	
    gameEngine.init(ctx);
    gameEngine.start();
	startInput();
	
	// Backgrounds (gameEngine, spritesheet, x, y, speed, numberOfRepeats)
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer1.png"), -1535, 0, 35, 7));
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/layer2.png"), -1535, -50, 75, 8));


	gameEngine.createLevelOneMap();
	gameEngine.createHero();	
	gameShop = new GameShop(gameEngine, AM.getAsset("./img/pointer.png"));
	gameMenu = new GameMenu(gameEngine);
	gameEngine.addEntity(gameShop);
	gameEngine.addEntity(gameMenu);
	
    
	console.log("All Done!");
});

function loadCheckPoint() {
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
	
	if (gameEngine.level === 1) {
		
		hero.x = heroCheckPoint.x;
		hero.y = 0;
		hero.falling = true;
		
		Camera.x = heroCheckPoint.cameraX;
		gameEngine.createLevelOneMap();
		gameEngine.loadLevelOneCheckPoint();
		gameEngine.Hero = hero;
		gameEngine.addEntity(gameEngine.Hero);
	}
	alert("Loading CheckPoint");
}



function startGame() {
	Camera.lock = false;
	if (gameEngine.level === 1) {
		gameEngine.loadLevelOne();
	} else {
		// console.log(gameEngine.Hero.speed);
		
		gameEngine.loadLevelOne();
	}
	

}


function resetGame() {
	
	if (!gameEngine.shop) {
		gameEngine.Hero.reset();
		Camera.x = 0;
	}
	
	// for (var i = 0; i < gameEngine.monsters.length; i++) {
		// gameEngine.monsters[i].removeFromWorld = true;
	// }
	// for (var i = 0; i < gameEngine.powerups.length; i++) {
		// gameEngine.powerups[i].removeFromWorld = true;
	// }
	
	for (var i = 0; i < gameEngine.entities.length; i++) {
		var entity = gameEngine.entities[i];
		if (entity instanceof Soldier || 
			entity instanceof Background ||
			entity instanceof GameMenu ||
			entity instanceof GameShop) continue;
		entity.removeFromWorld = true;
	}
	
}


function startInput() {
	
	// buttons' events to start game, show settings, and credits
	gameEngine.ctx.canvas.addEventListener("click", function(event) {
		
		var rect = gameEngine.ctx.canvas.getBoundingClientRect();
		var pos = {x : event.clientX - rect.left, y : event.clientY - rect.top};
		if (!gameEngine.startGame && !gameEngine.showSetting && !gameEngine.showCredit) {
			if (gameEngine.playButton.isClick(pos)) {
				startGame();
				gameEngine.startGame = true;
				gameEngine.showSetting = false;
				gameEngine.showCredit = false;
			} 
		} 
		
		if (!gameEngine.startGame && !gameEngine.showCredit && gameEngine.settingButton.isClick(pos)) {
				gameEngine.showSetting = true;
		}
		
				
		if (!gameEngine.startGame && gameEngine.creditButton.isClick(pos)) {
			gameEngine.showCredit = true;
		}
		
		if (!gameEngine.startGame && gameEngine.gobackButton.isClick(pos)) {
			gameEngine.showSetting = false;
			gameEngine.startGame = false;
			gameEngine.showCredit = false;
		}
	
		if (gameEngine.gameOver && gameEngine.playAgainButton.isClick(pos)) {
			// gameEngine.restartGame = true;
			gameEngine.startGame = true;
			gameEngine.gameOver = false;
			resetGame();
			startGame();
		}
		
		if (gameEngine.shop && gameEngine.continueButton.isClick(pos)) {
			gameEngine.shop = false;
			gameEngine.checkPoint = false;
			resetGame();
			startGame();
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
				case 38:
					gameShop.moveUp = true;
					break;
				case 13: // purchase item
					
					gameShop.purchaseItem();
					
						
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
				
			// D
            case 68:
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
            case 83:
				if (gameEngine.Hero.weaponsIndex + 2 > gameEngine.Hero.weapons.length) {
					gameEngine.Hero.weapon = gameEngine.Hero.weapons[0];
					gameEngine.Hero.weaponsIndex = 0;
				}
				else {
					gameEngine.Hero.weapon = gameEngine.Hero.weapons[gameEngine.Hero.weaponsIndex+1];
					gameEngine.Hero.weaponsIndex++;
				}
				
                break;
				
		}
	});
}