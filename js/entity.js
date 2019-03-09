/*
Tile
*/

function Tile(game, spritesheet, sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats) {
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
	this.game = game;
	this.x = x;
	this.y = y;
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.width = width;
	this.height = height;
	this.numberOfXRepeats = numberOfXRepeats;
	this.numberOfYRepeats = numberOfYRepeats;
	Entity.call(game, spritesheet, sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats);
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Tile.prototype.draw = function () {
	for (var rows = 0; rows < this.numberOfYRepeats; rows++) {
		for (var i = 0; i < this.numberOfXRepeats; i++)  
			this.ctx.drawImage(this.spritesheet, this.sourceX, this.sourceY,
			this.width, this.height,
			Math.round(this.x - Camera.x + (this.width * i)), this.y + (this.height * rows),
			this.width, this.height);
	}
    
    Entity.prototype.draw.call(this);
}

/*
Background
*/
function Background(game, spritesheet, x, y, speed, numberOfRepeats) {
    this.animation = new Animation(spritesheet, 3072, 1536, 1, 0.1, 1, true, 0.5);
    this.spritesheet = spritesheet;
    this.speed = speed;
    this.ctx = game.ctx;
	this.game = game;
	this.numberOfRepeats = numberOfRepeats;
    Entity.call(this, game, x, y);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    if (this.game.Hero.moving) this.x -= this.game.clockTick * this.speed * this.game.Hero.direction;
    Entity.prototype.update.call(this);
}

Background.prototype.draw = function () {
	// if (this.game.endLevel) {
		// this.game.endLevel = false;
		// resetGame();
		// startGame();
	// }
    for (var i = 0; i < this.numberOfRepeats; i++)  
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x + (i*this.animation.frameWidth/2), this.y);
	
	
	
    Entity.prototype.draw.call(this);
}



function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (oth) {
    if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
    return false;
}

/*
Tile Platform
*/
function TilePlatform(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles) {
    this.ctx = game.ctx;
	this.game = game;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
	this.numberOfTiles = numberOfTiles;
    this.x = x;
    this.y = y;
    this.sourceXTopLeft = sourceXTopLeft;
    this.sourceYTopLeft = sourceYTopLeft;
    this.sourceXTopMid = sourceXTopMid;
    this.sourceYTopMid = sourceYTopMid;
    this.sourceXTopRight = sourceXTopRight;
    this.sourceYTopRight = sourceYTopRight;
	this.sourceXLeft = sourceXLeft;
	this.sourceYLeft = sourceYLeft;
	this.sourceXMid = sourceXMid;
	this.sourceYMid = sourceYMid;
	this.sourceXRight = sourceXRight;
	this.sourceYRight = sourceYRight;
    this.boundingbox = new BoundingBox(x, y, width*numberOfTiles, height);
    Entity.call(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles);
}

TilePlatform.prototype = new Entity();
TilePlatform.prototype.constructor = TilePlatform;

TilePlatform.prototype.draw = function () {
	
    for (var y = 0; y < 700-this.y; y+=this.height) {
        for (var i=0; i < this.numberOfTiles; i++) {
            if (i === 0) {
                if (y === 0) {
                    this.ctx.drawImage(this.spritesheet,
                        this.sourceXTopLeft, this.sourceYTopLeft,  // source from sheet
                        this.width, this.height,
                        this.x - Camera.x, this.y + y,
                        this.width, this.height);
                } else {
                    this.ctx.drawImage(this.spritesheet,
                        this.sourceXLeft, this.sourceYLeft,  // source from sheet
                        this.width, this.height,
                        this.x - Camera.x, this.y + y,
                        this.width, this.height);
                }                
            } else if (i < this.numberOfTiles - 1) {
                if (y === 0) {
                    this.ctx.drawImage(this.spritesheet,
                     this.sourceXTopMid, this.sourceYTopMid,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y + y,
                     this.width, this.height);
                } else {
                    this.ctx.drawImage(this.spritesheet,
                     this.sourceXMid, this.sourceYMid,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y + y,
                     this.width, this.height);
                }               
            } else {
                if (y === 0) {
                    this.ctx.drawImage(this.spritesheet,
                     this.sourceXTopRight, this.sourceYTopRight,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y + y,
                     this.width, this.height);
                } else {
                    this.ctx.drawImage(this.spritesheet,
                     this.sourceXRight, this.sourceYRight,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y + y,
                     this.width, this.height);
                }
                
            }	
        }
    }
    
	
	
    Entity.prototype.draw.call(this);
}
TilePlatform.prototype.update = function () {
    Entity.prototype.update.call(this);
}


/******************************************************************************************************************
Waterfall
*/
function Waterfall(game, spritesheet, sourceXWater, sourceYWater, sourceXTopSplash, sourceYTopSplash, sourceXBotSplash, sourceYBotSplash, 
	x, y, width, height, waterfallWidth, waterfallHeight) {
		
	this.animationWater = new CustomAnimation(spritesheet, sourceXWater, sourceYWater, 4, width, height, 3, 7, 3, true, 1);
	this.animationSplashTop = new CustomAnimation(spritesheet, sourceXTopSplash, sourceYTopSplash, 2, 50, 14, 2, 1.5, 2, true, 1);
	this.animationSplashBot = new CustomAnimation(spritesheet, sourceXBotSplash, sourceYBotSplash, 2, 50, 14, 2, 1.5, 2, true, 1);
    this.ctx = game.ctx;
	this.game = game;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
	this.waterfallWidth = waterfallWidth;
	this.waterfallHeight = waterfallHeight;
    this.x = x;
    this.y = y;
	this.sourceXWater = sourceXWater;
    this.sourceYWater = sourceYWater;
	this.sourceXTopSplash = sourceXTopSplash;
	this.sourceYTopSplash = sourceYTopSplash;
	this.sourceXBotSplash = sourceXBotSplash;
	this.sourceYBotSplash = sourceYBotSplash;
	this.active = false;
	
    Entity.call(game, spritesheet, sourceXWater, sourceYWater, sourceXTopSplash, sourceYTopSplash, sourceXBotSplash, sourceYBotSplash, 
	x, y, width, height, waterfallWidth, waterfallHeight);
}

Waterfall.prototype = new Entity();
Waterfall.prototype.constructor = Waterfall;

Waterfall.prototype.update = function () {
    if (this.x - this.game.Hero.x < 500) this.active = true;
	Entity.prototype.update.call(this);
}
Waterfall.prototype.draw = function () {
	if (this.active) {
		for (var y = 0; y < this.waterfallHeight; y++) {
			for (var i=0; i < this.waterfallWidth; i++) {
				this.animationWater.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x + (i*this.width), this.y+(y*this.height));	
				
				if (y === 0) this.animationSplashTop.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x + (i*this.width), this.y+(y*this.height) - 3);
				else if (y === this.waterfallHeight - 1) this.animationSplashBot.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x + (i*this.width), this.y+(y*this.height) + this.height - 9);
			}
		}	
	}
    
    
    Entity.prototype.draw.call(this);
}
//*****************************************************************************************************************



/*
Platforms
*/
function Platform(game, spritesheet, x, y, width, height, numberOfPlatforms) {
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
	this.numberOfPlatforms = numberOfPlatforms;
    this.x = x;
    this.y = y;
    this.boundingbox = new BoundingBox(x, y+4, width*numberOfPlatforms, height-25);
    Entity.call(this, game, x, y, width, height);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.draw = function () {
	
	for (var i = 0; i < this.numberOfPlatforms; i++) {
		this.ctx.drawImage(this.spritesheet, this.x - Camera.x + (this.width*i), this.y);	
	}
    
    Entity.prototype.draw.call(this);
}
Platform.prototype.update = function () {
    Entity.prototype.update.call(this);
}


/*
PowerUp
*/
function PowerUp(game, spritesheet, x, y, width, height, scale, type) {
	if (type === "shield" || type === "grenade" || type === "airstrike") this.animation = new Animation(spritesheet, width, height, 1, 0.5, 1, true, scale);
	else if (type === "exit") this.animation = new Animation(spritesheet, width, height, 8, 0.03, 32, true, scale);
	else this.animation = new Animation(spritesheet, width, height, 8, 0.08, 8, true, scale);
    this.ctx = game.ctx;
	this.game = game;
    this.spritesheet = spritesheet;
	this.type = type;
    this.width = width * scale;
    this.height = height * scale;
    this.x = x;
    this.y = y;
	this.basey = y;
    if (this.type === "exit") this.boundingbox = new BoundingBox(x+40, y+44, this.width/2 - 10, this.height/2);
	else this.boundingbox = new BoundingBox(x, y, this.width, this.height);
	this.floatHeight = 10;
	this.soundCoin = new Sound("audio/coin.wav");
	this.soundHealth = new Sound("audio/health.wav");
	this.soundShield = new Sound("audio/shield.wav");
	this.soundExit = new Sound("audio/exit.wav");
    Entity.call(this, game, x, y, width, height, scale, type);
}

PowerUp.prototype = new Entity();
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.update = function () {
	var duration;
		 
	duration = this.animation.elapsedTime + this.game.clockTick;
	if (duration > this.animation.totalTime / 2) duration = this.animation.totalTime - duration;
	duration = duration / this.animation.totalTime;
		
	// float effect
	if (this.type !== "exit") {
		height = (4 * duration - 4 * duration * duration) * this.floatHeight;
		this.y = this.basey - height;
	}
	if (this.type === "exit") this.boundingbox = new BoundingBox(this.x+40, this.y+44, this.width/2 - 10, this.height/2);
    else this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
	
	// check for hero collision
	if (this.type === "health") {
		if (this.game.Hero.health <= this.game.Hero.maxHealth - 1) {
			if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
					if (DEBUG) console.log("Hero got " + this.type + " power up!");
					this.soundHealth.play();
					this.game.Hero.health++;
					this.removeFromWorld = true;
			}	
		}	
	}
	else if (this.type === "coin") {
		if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
					if (DEBUG) console.log("Hero got " + this.type + " power up!");
					this.game.Hero.coins++;
					this.soundCoin.play();
					this.removeFromWorld = true;
		}
	}
	else if (this.type === "shield") {
		if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
					if (DEBUG) console.log("Hero got " + this.type + " power up!");
					this.game.Hero.shield += 3;
					this.soundShield.play();
					this.removeFromWorld = true;
		}
	}
	else if (this.type === "grenade") {
		if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
					if (DEBUG) console.log("Hero got " + this.type + " power up!");
					
					// no specials
					if (this.game.Hero.specials.length === 0) {
						this.game.Hero.specials.push("grenade");
						this.game.Hero.grenades++; 
					} 
					// increment grenades
					else {
						for (var i = 0; i < this.game.Hero.specials.length; i ++) {
							if (this.game.Hero.specials[i] === "grenade") {
								this.game.Hero.grenades++; 
								break;
							}
							if (i === this.game.Hero.specials.length-1) {
								this.game.Hero.specials.push("grenade");
							}
						}
					}
				
					this.removeFromWorld = true;
					
		}
	}	
	else if (this.type === "airstrike") {
		if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
					if (DEBUG) console.log("Hero got " + this.type + " power up!");
					
					// no specials
					if (this.game.Hero.specials.length === 0) {
						this.game.Hero.specials.push("airstrike");
						this.game.Hero.airstrikes++; 
					} 
					// increment airstrikes
					else {
						for (var i = 0; i < this.game.Hero.specials.length; i ++) {
							if (this.game.Hero.specials[i] === "airstrike") {
								this.game.Hero.airstrikes++; 
								break;
							}
							if (i === this.game.Hero.specials.length-1) {
								this.game.Hero.specials.push("airstrike");
							}
						}
					}
				
					this.removeFromWorld = true;
					
		}
	}	
	else if (this.type === "exit") {
		if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
					if (DEBUG) console.log("Hero got " + this.type + " power up!");			
					this.soundExit.play();
					this.removeFromWorld = true;
					this.game.level++;
					this.game.Hero.removeFromWorld = true;
					this.game.shop = true;
					resetGame();
					// this.game.endLevel = true;
		}
	}
		
	Entity.prototype.update.call(this);
}

PowerUp.prototype.draw = function () {
	
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
		this.ctx.strokeStyle = "green";
		this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
    
    Entity.prototype.draw.call(this);
}


/*
Flying Robot
*/
function FlyingRobot(game, spritesheet, x, y, width, height, powerUp, powerUpType) {
    this.animation = new CustomAnimation(spritesheet, 149, 619, 1, 50, 50, 2, 0.25, 2, true, 1);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 0.4);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
	this.width = width;
    this.height = height;
	this.speed = 50;
    this.x = x;
    this.y = y;
	this.hitPoints = 3;
	this.active = false;
	this.powerUp = powerUp;
	this.powerUpType = powerUpType;
	this.soundDeath = new Sound("audio/death-enemy.wav");
    this.boundingbox = new BoundingBox(x, y, width, height);
    Entity.call(game, spritesheet, x, y, width, height, powerUp, powerUpType);
}

FlyingRobot.prototype = new Entity();
FlyingRobot.prototype.constructor = FlyingRobot;

FlyingRobot.prototype.update = function () {
	
    // monster dead
	if (this.animationDie.isDone()) {
	    this.game.Hero.score += 100;
        // drop powerUp
	    if (this.powerUp) dropPowerUp(this);
	        
		this.soundDeath.play();
		this.removeFromWorld = true;
	}

	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
	if (this.x - this.game.Hero.x < 405) {
		this.active = true;
		// alert("Check Point");	
	}
	if (this.hitPoints > 0) {
		if (this.active) {
			// move to left
			this.x -= this.game.clockTick * this.speed;
			
			// check for bullet
			for (var i = 0; i < this.game.bullets.length; i++) {
				var bullet = this.game.bullets[i];
				
				// hit by bullet            
				if (!bullet.hit && this.boundingbox.collide(bullet.boundingbox)) {
					if (DEBUG) console.log("hit!");
					this.hitPoints -= this.game.Hero.weaponDamage;
					bullet.hit = true;
				}
			}
			
			// check for Hero collide
			if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
				if (DEBUG) console.log("collide with hero!");
				if (!this.game.Hero.hit) this.game.Hero.hit = true;
			}	
	
		}
	}
	
	
	Entity.prototype.update.call(this);
}

FlyingRobot.prototype.draw = function () {
	
	if (this.hitPoints <= 0) {	
		if (this.animationDie.elapsedTime === 0) this.soundDeath.play();

		if (this.animationDie.isDone()) {
			for( var i = 0; i < this.game.monsters.length; i++){ 
				if ( this.game.monsters[i] === this) {
					this.game.monsters.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		else this.animationDie.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);		
	}
    else this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
    //this.ctx.drawImage(this.spritesheet, this.x - Camera.x, this.y);
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
		this.ctx.strokeStyle = "green";
		this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
}


/*
Turret
*/
function Turret(game, spritesheet, x, y, width, height, powerUp, powerUpType) {
    this.animation = new CustomAnimation(spritesheet, 47, 159, 1, 50, 50, 1, 1.75, 1, false, 1);
	this.animationShoot = new CustomAnimation(spritesheet, 47, 159, 1, 50, 50, 2, 0.20, 2, false, 1);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 0.4);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
    this.width = width;
    this.height = height;
    this.speed = 50;
    this.x = x;
    this.y = y;
    this.hitPoints = 3;
    this.active = false;
    this.powerUp = powerUp;
    this.powerUpType = powerUpType;
    this.shooting = false;
	this.soundDeath = new Sound("audio/death-enemy.wav");
    this.boundingbox = new BoundingBox(x, y+20, width, height-20);
    Entity.call(game, spritesheet, x, y, width, height, powerUp, powerUpType);
}

Turret.prototype = new Entity();
Turret.prototype.constructor = Turret;

Turret.prototype.update = function () {
    // monster dead
    if (this.animationDie.isDone()) {
        this.game.Hero.score += 250;
        // drop powerUp
        if (this.powerUp) dropPowerUp(this);
    }

    this.boundingbox = new BoundingBox(this.x, this.y+20, this.width, this.height-20);
    if (this.x - this.game.Hero.x < 405) {
        this.active = true;
    }

	if (this.hitPoints > 0) {
		if (this.active) {

			// check for bullet
			for (var i = 0; i < this.game.bullets.length; i++) {
				var bullet = this.game.bullets[i];

				// hit by bullet            
				if (!bullet.hit && this.boundingbox.collide(bullet.boundingbox)) {
					if (DEBUG) console.log("hit!");
					bullet.hit = true;
					this.hitPoints -= this.game.Hero.weaponDamage;
				}
			}

			// check for Hero collide
			if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
				if (DEBUG) console.log("collide with hero!");
				if (!this.game.Hero.hit) this.game.Hero.hit = true;
			}

			// shooting
			if (this.animationShoot.elapsedTime + this.game.clockTick > this.animationShoot.totalTime) {
					this.animationShoot.elapsedTime = 0;
					this.animation.elapsedTime = 0;
					this.shooting = false;
					
					var bullet = new Cannonball(this.game, this.x - 7, this.y + 29, -1);
					this.game.addEntity(bullet);
					this.game.bulletsBad.push(bullet);
					
			}
			// idle
			else if (this.animation.elapsedTime + this.game.clockTick > this.animation.totalTime) {
					this.animationShoot.elapsedTime = 0;
					this.animation.elapsedTime = 0;
					this.shooting = true;
			}
		}
	}
    
		
    Entity.prototype.update.call(this);
}

Turret.prototype.draw = function () {

	// dead
	if (this.hitPoints <= 0) {	
		if (this.animationDie.elapsedTime === 0) this.soundDeath.play();

		if (this.animationDie.isDone()) {
			for( var i = 0; i < this.game.monsters.length; i++){ 
				if ( this.game.monsters[i] === this) {
					this.game.monsters.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		else this.animationDie.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);		
	} else {
		if (this.shooting) { 
			this.animationShoot.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		} else {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		}
	}
	
    if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
    }
}


/*
Mech
*/
function Mech(game, spritesheet, x, y, width, height, powerUp, powerUpType) {
    this.animation = new CustomAnimation(spritesheet, 136, 155, 1, 140, 108, 1, 1.5, 1, false, 0.75);
	this.animationShoot = new CustomAnimation(spritesheet, 136, 267, 1, 140, 108, 2, 0.20, 2, false, 0.75);
	this.animationJump = new CustomAnimation(spritesheet, 136, 379, 1, 140, 108, 1, 0.50, 1, false, 0.75);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 0.84);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
    this.width = width * 0.75;
    this.height = height * 0.75;
    this.speed = 100;
    this.x = x;
    this.y = y;
    this.hitPoints = 8;
    this.active = false;
    this.powerUp = powerUp;
    this.powerUpType = powerUpType;
    this.shooting = true;
	this.jumping = false;
	this.idle = false;
	this.jumpHeight = 25;
	this.baseY = y;
	this.baseX = x;
	this.soundDeath = new Sound("audio/death-enemy.wav");
    this.boundingbox = new BoundingBox(x+27, y, this.width-35, this.height);
    Entity.call(game, spritesheet, x, y, width, height, powerUp, powerUpType);
}

Mech.prototype = new Entity();
Mech.prototype.constructor = Mech;

Mech.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x+27, this.y, this.width-35, this.height);
	// monster dead
    if (this.animationDie.isDone()) {
        this.game.Hero.score += 500;
        // drop powerUp
        if (this.powerUp) dropPowerUp(this);
    }

    
    if (this.x - this.game.Hero.x < 405) {
        this.active = true;
		if (!this.game.checkPoint) {
			heroCheckPoint.x = this.game.Hero.x;
			heroCheckPoint.y = this.game.Hero.y;
			heroCheckPoint.cameraX = Camera.x;
			// alert("I am here");
		}
		this.game.checkPoint = true;
		
		// saveCheckPoint();
		// alert("Check Point");
    }
	
	//console.log("jumping=" + this.jumping);
	//console.log("shooting=" + this.shooting);
	if (this.hitPoints > 0) {

		if (this.active) {

			// check for bullet
			for (var i = 0; i < this.game.bullets.length; i++) {
				var bullet = this.game.bullets[i];

				// hit by bullet            
				if (!bullet.hit && this.boundingbox.collide(bullet.boundingbox)) {
					if (DEBUG) console.log("hit!");
					bullet.hit = true;
					this.hitPoints -= this.game.Hero.weaponDamage;
				}
			}

			// check for Hero collide
			if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
				if (DEBUG) console.log("collide with hero!");
				if (!this.game.Hero.hit) this.game.Hero.hit = true;
				
			}

			// jumping movement
			if (this.jumping) {
				var duration;
				duration = this.animationJump.elapsedTime + this.game.clockTick;
				if (duration > this.animationJump.totalTime / 2) duration = this.animationJump.totalTime - duration;
				duration = duration / this.animationJump.totalTime;

				// parbolic jump
				var height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
				this.y = this.baseY - height;
				this.x -= Math.round(this.game.clockTick * this.speed);
			}
			
			
			// shooting
			if ( this.shooting && this.animationShoot.elapsedTime + this.game.clockTick > this.animationShoot.totalTime) {
					this.animationShoot.elapsedTime = 0;
					this.animation.elapsedTime = 0;
					this.animationJump.elapsedTime = 0;
					this.shooting = false;
					this.idle = true;
					
					var bullet = new Cannonball(this.game, this.x - 7, this.y + 33, -1);
					this.game.addEntity(bullet);
					this.game.bulletsBad.push(bullet);
					
			}
			
			// jumping
			else if (this.jumping && this.animationJump.elapsedTime + this.game.clockTick > this.animationJump.totalTime) {
					this.animationShoot.elapsedTime = 0;
					this.animation.elapsedTime = 0;
					this.animationJump.elapsedTime = 0;
					this.jumping = false;
					this.shooting = true;
			}
			
			// idle
			else if (this.idle && this.animation.elapsedTime + this.game.clockTick > this.animation.totalTime) {
					this.animationShoot.elapsedTime = 0;
					this.animation.elapsedTime = 0;
					this.animationJump.elapsedTime = 0;
					this.jumping = true;
			} 
		}
	}
	
    
		
    Entity.prototype.update.call(this);
}

Mech.prototype.draw = function () {
	if (this.hitPoints <= 0) {	
		if (this.animationDie.elapsedTime === 0) this.soundDeath.play();

		if (this.animationDie.isDone()) {
			this.soundDeath.play();
			for( var i = 0; i < this.game.monsters.length; i++){ 
				if ( this.game.monsters[i] === this) {
					this.game.monsters.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		else this.animationDie.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);		
	} else {
		if (this.shooting) { 
			this.animationShoot.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		} else if (this.jumping) {
			this.animationJump.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		} else if (this.idle) {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		}
	}
	


    if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
    }
}


/*
Boss 1
*/
function Boss1(game, spritesheet, x, y, width, height, powerUp, powerUpType) {
    this.animationNotActive = new CustomAnimation(spritesheet, 136, 584, 1, 140, 108, 1, 2.75, 1, true, 0.75);
	this.animationIdleLeft = new CustomAnimation(spritesheet, 136, 584, 1, 140, 108, 1, 1, 1, false, 0.75);
	this.animationIdleRight = new CustomAnimation(spritesheet, 277, 584, 1, 140, 108, 1, 1, 1, false, 0.75);
	this.animationChargeLeft = new CustomAnimation(spritesheet, 136, 808, 1, 140, 108, 1, 1.75, 1, false, 0.75);
	this.animationChargeRight = new CustomAnimation(spritesheet, 277, 808, 1, 140, 108, 1, 1.75, 1, false, 0.75);
	this.animationShootLeft = new CustomAnimation(spritesheet, 136, 696, 1, 140, 108, 2, 0.75, 2, false, 0.75);
	this.animationShootRight = new CustomAnimation(spritesheet, 559, 696, -281, 140, 108, 2, 0.75, 2, false, 0.75);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 0.84);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
    this.width = width * 0.75;
    this.height = height * 0.75;
    this.speed = 400;
    this.x = x;
    this.y = y;
	this.baseX = x;
    this.hitPoints = 16;
    this.active = false;
    this.powerUp = powerUp;
    this.powerUpType = powerUpType;
	this.charging = true;
	this.idle = false;
	this.shooting = false;
	this.direction = -1;
	this.shootCount = 0;
	this.idleState = 1;
	this.soundDeath = new Sound("audio/death-enemy.wav");
    this.boundingbox = new BoundingBox(x+27, y, this.width-35, this.height);
    Entity.call(game, spritesheet, x, y, width, height, powerUp, powerUpType);
}

Boss1.prototype = new Entity();
Boss1.prototype.constructor = Boss1;

Boss1.prototype.update = function () {
    this.boundingbox = new BoundingBox(this.x+27, this.y, this.width-35, this.height);
	
	// monster dead
    if (this.animationDie.isDone()) {
        this.game.Hero.score += 1000;
        // drop powerUp
        if (this.powerUp) dropPowerUp(this);
    }

	// alive
    if (this.hitPoints > 0) {
		if (this.x - this.game.Hero.x < 325 && this.game.Hero.y > 450) {
			this.active = true;
		}
		
		if (this.active) {

			// check for bullet
			for (var i = 0; i < this.game.bullets.length; i++) {
				var bullet = this.game.bullets[i];

				// hit by bullet            
				if (!bullet.hit && this.boundingbox.collide(bullet.boundingbox)) {
					if (DEBUG) console.log("hit!");
					bullet.hit = true;
					this.hitPoints -= this.game.Hero.weaponDamage;
				}
			}
	
			// check for Hero collide
			if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
				if (DEBUG) console.log("collide with hero!");
				if (!this.game.Hero.hit) this.game.Hero.hit = true;
			}
	
			// charging
			if (this.charging) {
				var moveTick = Math.round(this.game.clockTick * this.speed * this.direction);
				this.x += moveTick;
				
				// charge done
				//if ( Math.abs(this.x - this.baseX) >= 700 ) {
				if ( (this.animationChargeLeft.elapsedTime + this.game.clockTick > this.animationChargeLeft.totalTime) 
						|| (this.animationChargeRight.elapsedTime + this.game.clockTick > this.animationChargeRight.totalTime) ) {
					this.baseX = this.x;
					this.animationIdleLeft.elapsedTime = 0;
					this.animationIdleRight.elapsedTime = 0;
					this.animationChargeLeft.elapsedTime = 0;
					this.animationChargeRight.elapsedTime = 0;
					this.animationShootLeft.elapsedTime = 0;
					this.animationShootRight.elapsedTime = 0;
					this.charging = false;
					this.idle = true;
					this.idleState = 1;
					this.direction *= -1;
				}
			}

			// idle
			else if (this.idle) {
				
				// idle done
				if ( (this.animationIdleLeft.elapsedTime + this.game.clockTick > this.animationIdleLeft.totalTime) 
						|| (this.animationIdleRight.elapsedTime + this.game.clockTick > this.animationIdleRight.totalTime) ) {
					this.animationIdleLeft.elapsedTime = 0;
					this.animationIdleRight.elapsedTime = 0;
					this.animationChargeLeft.elapsedTime = 0;
					this.animationChargeRight.elapsedTime = 0;
					this.animationShootLeft.elapsedTime = 0;
					this.animationShootRight.elapsedTime = 0;
					
					if (this.idleState === 1) this.shooting = true;
					else this.charging = true;
					
					this.idle = false;
					
				}
			} 
			
			// shooting
			else if (this.shooting) {
			
				// shooting done
				if ( (this.animationShootLeft.elapsedTime + this.game.clockTick > this.animationShootLeft.totalTime) 
					|| (this.animationShootRight.elapsedTime + this.game.clockTick > this.animationShootRight.totalTime) ) {
						
					// shoot cannon
					if (this.direction === -1) var bullet = new Cannonball(this.game, this.x - 7, this.y + 28, this.direction);
					else var bullet = new Cannonball(this.game, this.x + 100, this.y + 28, this.direction);
					
					this.game.addEntity(bullet);
					this.game.bulletsBad.push(bullet);
				
					this.animationIdleLeft.elapsedTime = 0;
					this.animationIdleRight.elapsedTime = 0;
					this.animationChargeLeft.elapsedTime = 0;
					this.animationChargeRight.elapsedTime = 0;
					this.animationShootLeft.elapsedTime = 0;
					this.animationShootRight.elapsedTime = 0;
					this.shootCount++;
					if (this.shootCount >= 2) {
						this.shootCount = 0;
						this.shooting = false;
						this.idle = true;
						this.idleState = 2;
					}
					
				}
			}
		}	
	}
    
		
    Entity.prototype.update.call(this);
}

Boss1.prototype.draw = function () {
	
	// dead
	if (this.hitPoints <= 0) {	
		if (this.animationDie.elapsedTime === 0) this.soundDeath.play();

		if (this.animationDie.isDone()) {
			this.soundDeath.play();
			for( var i = 0; i < this.game.monsters.length; i++){ 
				if ( this.game.monsters[i] === this) {
					this.game.monsters.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		else this.animationDie.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);		
		
	// not active
	} else if (!this.active) {
		this.animationNotActive.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	
	// fight
	} else {
		if (this.charging) {
			if (this.direction === -1) this.animationChargeLeft.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
			else this.animationChargeRight.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		} else if (this.idle) {
			if (this.direction === -1) this.animationIdleLeft.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
			else this.animationIdleRight.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		} else if (this.shooting) {
			if (this.direction === -1) this.animationShootLeft.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
			else this.animationShootRight.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		}
	}
	
    if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
    }
}


/*
Running Soldier
*/
function Soldier(game, spritesheet, x, y) {
    //CustomAnimation(spriteSheet, startX, startY, offset, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.animationRight = new CustomAnimation(AM.getAsset("./img/hero.png"), 24, 315, 1, 50, 50, 8, 0.10, 8, true, 1);
	this.animationRightDown = new CustomAnimation(AM.getAsset("./img/hero.png"), 454, 856, 1, 50, 57, 8, 0.10, 8, true, 1);
    this.animationRightUp = new CustomAnimation(AM.getAsset("./img/hero.png"), 25, 856, 1, 50, 57, 8, 0.10, 8, true, 1);
	this.animationLeft = new CustomAnimation(AM.getAsset("./img/hero.png"), 24, 375, 1, 50, 50, 8, 0.10, 8, true, 1);
    this.animationLeftDown = new CustomAnimation(AM.getAsset("./img/hero.png"), 454, 994, 1, 50, 57, 8, 0.10, 8, true, 1);
	this.animationLeftUp = new CustomAnimation(AM.getAsset("./img/hero.png"), 25, 994, 1, 50, 57, 8, 0.10, 8, true, 1);
	//this.animationJumpRight = new CustomAnimation(AM.getAsset("./img/hero.png"), 126, 143, 1, 50, 50, 1, 0.68, 1, false, 1);
    //this.animationJumpLeft = new CustomAnimation(AM.getAsset("./img/hero.png"), 126, 200, 1, 50, 50, 1, 0.68, 1, false, 1);
	this.animationJumpRight = new CustomAnimation(AM.getAsset("./img/hero2.png"), 56, 175, 1, 50, 50, 4, 0.17, 4, false, 1);
    this.animationJumpLeft = new CustomAnimation(AM.getAsset("./img/hero2.png"), 56, 230, 1, 50, 50, 4, 0.17, 4, false, 1);
	this.animationHit = new CustomAnimation(AM.getAsset("./img/effects.png"), 778, 50, 0, 127, 126, 1, 1.5, 1, false, 0.55);
	this.animationLand = new Animation(AM.getAsset("./img/dust.png"), 258, 52, 1, 0.10, 5, true, 0.5);
	this.animationShield = new CustomAnimation(AM.getAsset("./img/shields.png"), 6, 153, 3, 48, 48, 9, 0.10, 9, true, 1);
	
	this.speed = 300;
    this.ctx = game.ctx;
    this.game = game;
    this.x = x;
    this.y = y;
    this.height = 50;
    this.width = 50;
    this.falling = true;
    this.jumping = false;
    this.jumpHeight = 115;
    this.moving = false;
    this.up = false;
	this.down = false;
	this.jump = false;
	this.shoot = false;
	this.shootElapsedTime = 5;
	this.specialElapsedTime = 5;
	this.hit = false;
	this.hitElapsedTime = 5;
	this.special = false;
    this.direction = 1;
	this.score = 0;
	this.maxHealth = 3;
	this.shield = 0;
	this.health = this.maxHealth;
	this.coins = 0;
    this.platform = game.platforms[0];
	this.specialsIndex = 0;
	this.grenades = 0;
	this.airstrikes = 0;
	this.specials = [];
	this.currentSpecial = "";
	this.lives = 3;
	this.weapons = [];
	this.weapons.push("basic");
	this.weapons.push("three-way");
	this.weaponsIndex = 0;
	this.weapon = "basic";
	this.weaponDamage = 1;
	this.soundDamage = new Sound("audio/damage.wav");
	this.soundJump = new Sound("audio/jump.wav");
    this.boundingbox = new BoundingBox(this.x+2, this.y+2, this.width-7, this.height);
	
    Entity.call(this, game, x, y);
}

Soldier.prototype = new Entity();
Soldier.prototype.constructor = Soldier;

Soldier.prototype.reset = function() {
	this.x = 200;
	this.y = 0;	    
	this.removeFromWorld = false;
	this.boundingbox = new BoundingBox(this.x+2, this.y+2, this.width-7, this.height);
	this.falling = true;
    this.jumping = false;
    this.moving = false;
    this.up = false;
	this.down = false;
	this.jump = false;
	this.shoot = false;
	this.shootElapsedTime = 5;
	this.specialElapsedTime = 5;
	this.hit = false;
	this.hitElapsedTime = 5;
	this.special = false;
    this.direction = 1;
	this.score = 0;
	this.maxHealth = 3;
	this.shield = 0;
	this.health = this.maxHealth;
	this.lives = 3;
	this.coins = 0;
	this.grenades = 0;
	this.currentSpecial = "";

}

Soldier.prototype.update = function () {
	this.shootElapsedTime += this.game.clockTick;
	this.specialElapsedTime += this.game.clockTick;
	this.hitElapsedTime += this.game.clockTick;
	this.lastboundingbox = this.boundingbox;
	
	if (this.specials.length > 0) this.currentSpecial = this.specials[this.specialsIndex];
	else this.currentSpecial = "";
	if (this.specialsIndex < 0) this.specialsIndex = 0;
	
	
	 if (this.health <= 0) {
		 this.game.gameOver = true;
		 this.removeFromWorld = true;
		 soundSong.stop();
	 }
	 
	
	/*
	if (this.health <= 0) {
		
		this.lives--;
		this.health = this.maxHealth;
		if (this.game.checkPoint && this.lives > 0) loadCheckPoint();
	}
	*/
	
	if (this.lives <= 0) {
		this.game.gameOver = true;
		this.game.checkPoint = false;
		this.removeFromWorld = true;
		soundSong.stop();
	}
	
	// check for enemy bullets
	for (var i = 0; i < this.game.bulletsBad.length; i++) {
		var bullet = this.game.bulletsBad[i];

		// hit by bullet            
		if (!bullet.hit && this.boundingbox.collide(bullet.boundingbox)) {
			
			if (DEBUG) console.log("hit!");
			bullet.hit = true;
			this.hit = true;
		}
	}
	
	// taken damage
	if (this.hit) {
		
		// 1.5 second cooldown
		if (this.hitElapsedTime > 1.5) {	
			this.soundDamage.play();
			if (this.shield > 0) this.shield--;
			else this.health --;
			this.hitElapsedTime = 0;
		}
		this.hit = false;
	}

    // moving
    if (this.moving) {
		if (this.direction === 1) this.boundingbox = new BoundingBox(this.x+14, this.y, this.width-13, this.height);
		else this.boundingbox = new BoundingBox(this.x+5, this.y, this.width-17, this.height);

		// move hero
		var moveTick = Math.round(this.game.clockTick * this.speed * this.direction);
		if (this.x + moveTick >= -5 && this.x + moveTick <= 7400) this.x += moveTick;
		
		// lock camera at boss
		if (!Camera.lock && Camera.x >= 6650) {
			Camera.lock = true;
			Camera.x = 6650;
		}
		
		// adjust camera
		if (Camera.lock === false) {
			if ((Camera.x + moveTick >= 0 && this.x - Camera.x >= 400 && this.direction === 1) 
				|| (Camera.x + moveTick >= 0 && this.x - Camera.x <= 400 && this.direction === -1) ) Camera.x += moveTick;		
		}
		
	}
		
    // shoot
    if (this.shoot) {
		
		// 0.35 second cooldown
		if (this.shootElapsedTime > 0.35) {
			var compensate = 37;
			var compensateY = 12;
			//var dir = 1;
			var aimY;
			if (this.direction === -1) {
				//dir = -1;
				compensate = -7;
			}
			if (this.up) {
				aimY = 1;
				compensateY -= 13;
			}
			else if (this.down) {
				aimY = -1;
				compensateY += 13;
			}
			else aimY = 0;
			
			var bullet = new Bullet(this.game, AM.getAsset("./img/bullet.png"), this.x + compensate, this.y + compensateY, this.direction, aimY);
			this.game.addEntity(bullet);
			this.game.bullets.push(bullet);
			
			if (this.weapon === "three-way") {
				var bullet = new Bullet(this.game, AM.getAsset("./img/bullet.png"), this.x + compensate, this.y + compensateY, this.direction, -1);
				this.game.addEntity(bullet);
				this.game.bullets.push(bullet);
				
				var bullet = new Bullet(this.game, AM.getAsset("./img/bullet.png"), this.x + compensate, this.y + compensateY, this.direction, 1);
				this.game.addEntity(bullet);
				this.game.bullets.push(bullet);
			}
			this.shootElapsedTime = 0; 
		} 
        
    }

	// use special
	if (this.special) {

		// cooldown
		if (this.specials.length > 0 && this.specialElapsedTime > 0.75) {
					
			// grenade
			if (this.currentSpecial === "grenade") {
				
				// has grenades
				if (this.grenades > 0) {
					console.log("grenade!");
					this.grenades--;
					var grenade = new Grenade(this.game, AM.getAsset("./img/PowerUp/grenade.png"), this.x + 15, this.y , this.direction, aimY);
					this.game.addEntity(grenade);
				
					// no more grenades
					if (this.grenades === 0 ) {
						
						this.currentSpecial = this.specials[this.specialsIndex-1];
						this.specials.splice(this.specialsIndex, 1);
						if (this.specialsIndex === this.specials.length) this.specialsIndex -= 1;
					}

					// reset cooldown
					this.specialElapsedTime = 0;
				}
			}
			
			// airstrike
			else if (this.currentSpecial === "airstrike") {
				
				// has airstrikes
				if (this.airstrikes > 0) {
					console.log("airstrike!");
					this.airstrikes--;
					var jet = new Jet(this.game, AM.getAsset("./img/PowerUp/jet.png"), Camera.x - 100, 100);
					this.game.addEntity(jet);
				
					// no more airstrikes
					if (this.airstrikes === 0 ) {
						
						this.currentSpecial = this.specials[this.specialsIndex-1];
						this.specials.splice(this.specialsIndex, 1);
						if (this.specialsIndex === this.specials.length) this.specialsIndex -= 1;
					}

					// reset cooldown
					this.specialElapsedTime = 0;
				}
			}

			console.log("index: " + this.specialsIndex);
			//this.specials.splice(this.currentSpecial, 1);

		}
		
	}

    // press up (jump)
    if (this.jump && !this.jumping && !this.falling) {
        this.jumping = true;
        this.basey = this.y;
		this.soundJump.play();
    }
	
    // free fall
    if (this.falling) {
		this.boundingbox = new BoundingBox(this.x+2, this.y+2, this.width-7, this.height);
    
        this.y += this.game.clockTick / this.animationJumpRight.totalTime * 4 * this.jumpHeight;
        
        // check for platform
        for (var i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            
            // landed on top of platform
            if (this.boundingbox.collide(pf.boundingbox) && this.lastboundingbox.bottom < pf.boundingbox.top) {
                if (DEBUG) console.log("Collision!");
                this.falling = false;
                this.y = pf.boundingbox.top - this.height;
                this.platform = pf;
				break;
            }  
        
        }
    }    

	// jumping
     else if (this.jumping) {

		var duration;

        duration = this.animationJumpRight.elapsedTime + this.animationJumpLeft.elapsedTime + this.game.clockTick;
        if (duration > this.animationJumpRight.totalTime / 2) duration = this.animationJumpRight.totalTime - duration;
        duration = duration / this.animationJumpRight.totalTime;

        // parbolic jump
        height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
        this.y = this.basey - height;

        this.lastBottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x+2, this.y+2, this.width-7, this.height);
                
        // check for platform
        for (var i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            
            // landed on top of platform            
            if (this.boundingbox.collide(pf.boundingbox) && this.lastBottom < pf.boundingbox.top) {
                if (DEBUG) console.log("Landed on a platform!");
                this.jumping = false;
				this.animationJumpLeft.elapsedTime = 0;
				this.animationJumpRight.elapsedTime = 0;

                this.y = pf.boundingbox.top - this.height;
                this.platform = pf;
				break;
            }
        }

    }
    
    // walk off edge
    else if (!this.jumping && !this.falling) {
        
		// walk off right edge
        if (this.boundingbox.left > this.platform.boundingbox.right) this.falling = true;
        // walk off left edge
        else if (this.boundingbox.right < this.platform.boundingbox.left) this.falling = true;
    }

    // Fall off screen
    if (this.y > 700) {
		
		this.lives--;
		this.health = this.maxHealth;
		if (this.game.checkPoint && this.lives > 0) loadCheckPoint();
		
		//this.health = 0;
		// this.game.shop = true;
		//this.y = -50;
	}
    Entity.prototype.update.call(this);
}

Soldier.prototype.draw = function () {
	
	// check if hit
	if (this.hitElapsedTime <= 1.5) {
		this.animationHit.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x - 11, this.y - 6);
		if (this.animationHit.elapsedTime + this.game.clockTick > this.animationHit.totalTime) this.animationHit.elapsedTime = 0;
	}
	
	// running
	if (this.moving && !this.jumping && !this.falling) {
		
		// running while aiming down
		if (this.down) {
			if (this.direction === 1) this.animationRightDown.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y-7);
			else this.animationLeftDown.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y-7);
			
		// running while aiming up
		} else if (this.up) {
			if (this.direction === 1) this.animationRightUp.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y-7);
			else this.animationLeftUp.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y-7);
		}
		
		// running while aiming straight
		else {
			if (this.direction === 1) this.animationRight.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
			else this.animationLeft.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);	
		}
		
	}
	
	// jumping
	else if (this.jumping) {
		
		// jumping right
		if (this.direction === 1) {
		    this.animationJumpRight.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		    if (this.animationJumpRight.isDone()) {
		        this.animationJumpRight.elapsedTime = 0;
				this.jumping = false;
				this.falling = true;
			}	
		}
		
		// jumping left
		else {
		    this.animationJumpLeft.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		    if (this.animationJumpLeft.isDone()) {
		        this.animationJumpLeft.elapsedTime = 0;
		        this.jumping = false;
				this.falling = true;
			}
		}
		
	}
	
	// falling
	else if (this.falling) {
	    if (this.direction === 1) this.ctx.drawImage(AM.getAsset("./img/hero.png"), 126, 143, 50, 50, this.x - Camera.x, this.y, 50, 50);
		else this.ctx.drawImage(AM.getAsset("./img/hero.png"), 126, 200, 50, 50, this.x - Camera.x, this.y, 50, 50);
	}
	
	// idle
	else if (!this.moving) {
		// aiming down
		if (this.down) {
			if (this.direction === 1) this.ctx.drawImage(AM.getAsset("./img/hero.png"), 25, 739, 50, 57, this.x - Camera.x, this.y-7, 50, 57);
			else this.ctx.drawImage(AM.getAsset("./img/hero.png"), 305, 739, 50, 57, this.x - Camera.x, this.y-7, 50, 57);	
		}

		// aiming up
		else if (this.up) {
			if (this.direction === 1) this.ctx.drawImage(AM.getAsset("./img/hero.png"), 25, 676, 50, 57, this.x - Camera.x, this.y-7, 50, 57);
			else this.ctx.drawImage(AM.getAsset("./img/hero.png"), 305, 676, 50, 57, this.x - Camera.x, this.y-7, 50, 57);	
		}
		
		// aim straight
		else {
			if (this.direction === 1) this.ctx.drawImage(AM.getAsset("./img/hero.png"), 24, 143, 50, 50, this.x - Camera.x, this.y, 50, 50);
			else this.ctx.drawImage(AM.getAsset("./img/hero.png"), 24, 200, 50, 50, this.x - Camera.x, this.y, 50, 50);	
		}
	    
	}
	
	// shielded
	if (this.shield > 0) {
	    this.animationShield.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x + 1, this.y + 3);
	}
	
	// draw UI
	this.drawUI();
	
	// bounding box
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
		this.ctx.strokeStyle = "green";
		this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
	Entity.prototype.draw.call(this);
}


Soldier.prototype.drawUI = function () {
	this.ctx.font = "bold 30px Arial";
	
	// Level
	this.ctx.fillText("Level: 1", 350, 30);
	
	// Score
	if (this.score === 0) this.ctx.fillText("Score: " + this.score, 675, 30);
	else this.ctx.fillText("Score: " + this.score, 675 - ((Math.log10(this.score) + 1) * 10), 30);
	
    // Health
	this.ctx.drawImage(AM.getAsset("./img/hero.png"), 24, 143, 50, 50, 0, 0, 50, 50);
	for (var i = 0; i < this.maxHealth; i++) {
	    if (i < this.health) this.ctx.drawImage(AM.getAsset("./img/heart.png"), 50 + (i * 35), 10, 35, 35);
	    else this.ctx.drawImage(AM.getAsset("./img/heartEmpty.png"), 50 + (i * 35), 10, 35, 35);
	}
	
	// Lives
	this.ctx.font = "bold 15px Arial";
	this.ctx.fillText("x"+this.lives, 40, 50);
	this.ctx.font = "bold 30px Arial";

	// Shield
	for (var i = 0; i < this.shield; i++) this.ctx.drawImage(AM.getAsset("./img/PowerUp/shield.png"), 50 + (this.maxHealth * 35) + (i * 35), 10, 35, 35);
	

	// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	
	// Coins
	if (this.coins === 0) this.ctx.drawImage(AM.getAsset("./img/PowerUp/coinIcon.png"), 730, 40, 35, 35);
	else {
		this.ctx.drawImage(AM.getAsset("./img/PowerUp/coinIcon.png"), 740 - (Math.log10(this.coins) + 1) * 10, 40, 35, 35);
		this.ctx.fillText(this.coins, 785 - (Math.log10(this.coins) + 1) * 10, 70);	
	}

	// Weapons
	this.ctx.drawImage(AM.getAsset("./img/weaponBackground.png"), 145, 0, 148, 106, 0, 50, 79, 53);
	this.ctx.drawImage(AM.getAsset("./img/weaponBackground.png"), 0, 0, 148, 106, 80, 50, 79, 53);
	if (this.weapon === "basic") this.ctx.drawImage(AM.getAsset("./img/bullet.png"), 0, 0, 14, 14, 20, 55, 42, 42);
	else if (this.weapon === "double") this.ctx.drawImage(AM.getAsset("./img/bullet2.png"), 0, 0, 14, 14, 20, 55, 42, 42);
	
	else if (this.weapon === "three-way") {
		if (this.weaponDamage === 1) this.ctx.drawImage(AM.getAsset("./img/bullet.png"), 0, 0, 14, 14, 20, 55, 42, 42);
		else this.ctx.drawImage(AM.getAsset("./img/bullet2.png"), 0, 0, 14, 14, 20, 55, 42, 42);
		
		this.ctx.font = "bold 15px Arial";
		this.ctx.fillText("x"+this.lives, 52, 92);
		this.ctx.font = "bold 30px Arial";
	}
	
	if (this.specials.length > 0) {
		// grenades
		if (this.currentSpecial === "grenade") {
			this.ctx.drawImage(AM.getAsset("./img/PowerUp/grenade.png"), 0, 0, 512, 512, 105, 61, 30, 30);
			this.ctx.font = "bold 15px Arial";
			this.ctx.fillText(this.grenades, 137, 92);
			this.ctx.font = "bold 30px Arial";
		}
		
		// air strikes
		else if (this.currentSpecial === "airstrike") {
			this.ctx.drawImage(AM.getAsset("./img/PowerUp/jet.png"), 0, 0, 825, 333, 95, 65, 50, 20);
			this.ctx.font = "bold 15px Arial";
			this.ctx.fillText(this.airstrikes, 137, 92);
			this.ctx.font = "bold 30px Arial";
		}
	}	
}


/*
Bullet
*/
function Bullet(game, spritesheet, x, y, direction, aimY) {
    this.animation = new Animation(spritesheet, 14, 14, 8, 1, 8, true, 1);
	this.animation2 = new Animation(AM.getAsset("./img/bullet2.png"), 14, 14, 8, 1, 8, true, 1);
    this.animationExplosion = new CustomAnimation(AM.getAsset("./img/explosions.png"), 641, 79, 5, 15, 15, 6, .05, 6, false, 1);
    this.speed = 500;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.width = 14;
	this.height = 14;
	this.startX = x;
	this.direction = direction;
	this.aimY = aimY;
	this.hit = false;
	this.soundShoot = new Sound("audio/shoot-1.wav");
	this.soundHit = new Sound("audio/hit.wav");
	this.soundShoot.play();
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.call(this, game, this.x, this.y);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
	if (!this.hit) {
		this.x += this.game.clockTick * this.speed * this.direction;
		this.y -= this.game.clockTick * this.speed * this.aimY/2;
		this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
		
		var distance = Math.abs(this.x - this.startX);
		if (distance > 400) {
			if (DEBUG) console.log("Bullet removed.");	
			for( var i = 0; i < this.game.bullets.length; i++){ 
				if ( this.game.bullets[i] === this) {
					this.game.bullets.splice(i, 1); 
					this.removeFromWorld = true;
				}
			}
		}
    }
	
    Entity.prototype.update.call(this);
}

Bullet.prototype.draw = function () {
	if (this.hit) {
		
		if (this.animationExplosion.elapsedTime === 0) this.soundHit.play();
		
		this.animationExplosion.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		if (this.animationExplosion.isDone()) {
			for( var i = 0; i < this.game.bullets.length; i++){ 
				if ( this.game.bullets[i] === this) {
					this.game.bullets.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		
	}
    else {
		if (this.game.Hero.weaponDamage === 1) this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		else this.animation2.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	}
	
	/*
	ctx.save();
    ctx.translate(x + this.width / 2, y + this.height / 2);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
                            -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
	*/
    Entity.prototype.draw.call(this);
}


/*
Grenade
*/
function Grenade(game, spritesheet, x, y, direction, aimY) {
    this.animation = new Animation(spritesheet, 512, 512, 1, 0.6, 1, false, 0.05);
	this.animationFall = new Animation(spritesheet, 512, 512, 1, 1, 1, true, 0.05);
	this.animationExplosion = new Animation(AM.getAsset("./img/grenadeBoom.png"), 96, 96, 5, 0.06, 14, false, 1);
    //this.animationExplosion = new CustomAnimation(AM.getAsset("./img/grenadeBoom.png"), 641, 79, 5, 15, 15, 6, .05, 6, false, 1);
    this.speed = 450;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.width = 512 * 0.05;
	this.height = 512 * 0.05;
	this.startX = x;
	this.direction = direction;
	this.jumpHeight = 150;
	this.aimY = aimY;
	this.basey = y;
	this.hit = false;
	this.exploding = false;
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
	this.explosionboundingbox = new BoundingBox(this.x, -500, this.width, this.height);
	this.sound = new Sound("audio/grenade.wav");
    Entity.call(this, game, this.x, this.y);
}

Grenade.prototype = new Entity();
Grenade.prototype.constructor = Grenade;

Grenade.prototype.update = function () {
	
	// in air
	if (!this.hit) {
		this.x += this.game.clockTick * this.speed * this.direction;
		
		if (!this.animation.isDone()) {
			var duration;

			duration = this.animation.elapsedTime + this.game.clockTick;
			if (duration > this.animation.totalTime / 2) duration = this.animation.totalTime - duration;
			duration = duration / this.animation.totalTime;

			// parbolic jump
			height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
			this.y = this.basey - height;	
		}
		else this.y += this.game.clockTick / this.animation.totalTime * 4 * this.jumpHeight;
		
		this.lastBottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
		
		// check for platform
        for (var i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            
            // landed on top of platform            
            if (this.boundingbox.collide(pf.boundingbox) && this.lastBottom < pf.boundingbox.top) {
                if (DEBUG) console.log("Grenade landed on a platform!");
                this.y = pf.boundingbox.top - this.height;
				this.hit = true;
				this.exploding = true;
				this.sound.play();
				break;
            }
        }
	} 
	
	// exploding
	else {
		this.explosionboundingbox = new BoundingBox(this.x-25, this.y-70, 96, 96);
		
		if (this.exploding) {
			// check for monster collision
			for( var i = 0; i < this.game.monsters.length; i++){
			
				var monster = this.game.monsters[i];
				if ( this.explosionboundingbox.collide(monster.boundingbox)) {
					monster.hitPoints -= 5;
					this.exploding = false;
				}
			}
		}
		
		if (this.animationExplosion.elapsedTime + this.game.clockTick > this.animationExplosion.totalTime) this.removeFromWorld = true;
		
	}
	
	
    // Fall off screen
    if (this.y > 700) {
		this.removeFromWorld = true;
    }
	
    Entity.prototype.update.call(this);
}

Grenade.prototype.draw = function () {
	
	if (this.hit) {
		this.animationExplosion.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x - 25, this.y-70);

	}
    else {
		if (!this.animation.isDone()) this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		else this.animationFall.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	}
	
	// bounding box
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
		this.ctx.strokeRect(this.explosionboundingbox.left - Camera.x, this.explosionboundingbox.top, this.explosionboundingbox.width, this.explosionboundingbox.height);
		this.ctx.strokeStyle = "green";
		this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
	
    Entity.prototype.draw.call(this);
}


/*
Jet
*/
function Jet(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 825, 333, 1, 1, 1, true, .15);
    this.speed = 600;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.elapsedTime = 0;
	this.baseX = x;

    Entity.call(this, game, this.x, this.y);
}

Jet.prototype = new Entity();
Jet.prototype.constructor = Jet;

Jet.prototype.update = function () {
	this.elapsedTime += this.game.clockTick;
	
	// drop bombs in intervals
	if (this.x < this.baseX+800) {
		if (this.elapsedTime > 0.25) {
			var bomb = new JetBomb(this.game, AM.getAsset("./img/PowerUp/missile.png"), this.x + 20, this.y);
			this.game.addEntity(bomb);
			this.elapsedTime = 0;
		}
	}
	
	
	this.x += this.game.clockTick * this.speed;
	if (this.x > Camera.x + 800) this.removeFromWorld = true;
	
    Entity.prototype.update.call(this);
}

Jet.prototype.draw = function () {
	
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	
    Entity.prototype.draw.call(this);
}


/*
Jet Bomb
*/
function JetBomb(game, spritesheet, x, y) {
	// (spriteSheet, startX, startY, offset, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
	this.animation = new Animation(spritesheet, 148, 125, 1, 0.6, 1, true, 0.6);
    //this.animation = new CustomAnimation(spritesheet, 13, 48, 4, 32, 62, 13, 0.05, 13, true, 1);
	this.animationExplosion = new Animation(AM.getAsset("./img/grenadeBoom.png"), 96, 96, 5, 0.06, 14, false, 1);
    this.speed = 400;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.width = 20;
	this.height = 125*.6;
	this.hit = false;
	this.exploding = false;
	this.boundingbox = new BoundingBox(this.x+36, this.y, this.width, this.height);
	this.explosionboundingbox = new BoundingBox(this.x, -500, this.width, this.height);
	this.sound = new Sound("audio/grenade.wav");
    Entity.call(this, game, this.x, this.y);
}

JetBomb.prototype = new Entity();
JetBomb.prototype.constructor = JetBomb;

JetBomb.prototype.update = function () {
	
	// in air
	if (!this.hit) {
		this.y += this.game.clockTick * this.speed;
		
		this.lastBottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x+36, this.y, this.width, this.height);
		
		// check for platform
        for (var i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            
            // landed on top of platform            
            if (this.boundingbox.collide(pf.boundingbox) && this.lastBottom < pf.boundingbox.top) {
                if (DEBUG) console.log("Bomb landed on a platform!");
                this.y = pf.boundingbox.top - this.height;
				this.hit = true;
				this.exploding = true;
				this.sound.play();
				break;
            }
        }
	} 
	
	// exploding
	else {
		this.explosionboundingbox = new BoundingBox(this.x, this.y-21, 96, 96);
		
		if (this.exploding) {
			// check for monster collision
			for( var i = 0; i < this.game.monsters.length; i++){
			
				var monster = this.game.monsters[i];
				if ( this.explosionboundingbox.collide(monster.boundingbox)) {
					monster.hitPoints -= 5;
					this.exploding = false;
				}
			}
		}
		
		if (this.animationExplosion.elapsedTime + this.game.clockTick > this.animationExplosion.totalTime) this.removeFromWorld = true;
		
	}
	
	
    // Fall off screen
    if (this.y > 700) {
		this.removeFromWorld = true;
    }
	
    Entity.prototype.update.call(this);
}

JetBomb.prototype.draw = function () {
	
	if (this.hit) this.animationExplosion.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y-21);
    else this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	
	// bounding box
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
		this.ctx.strokeRect(this.explosionboundingbox.left - Camera.x, this.explosionboundingbox.top, this.explosionboundingbox.width, this.explosionboundingbox.height);
		this.ctx.strokeStyle = "green";
		this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
	
    Entity.prototype.draw.call(this);
}


/*
Cannonball
*/
function Cannonball(game, x, y, direction) {
    this.animation = new CustomAnimation(AM.getAsset("./img/robots.png"), 162, 187, 0, 6, 6, 1, 1, 1, true, 2);
    this.animationExplosion = new CustomAnimation(AM.getAsset("./img/explosions.png"), 641, 367, 5, 15, 15, 6, .05, 6, false, 1);
    this.speed = 250;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.width = 12;
	this.height = 12;
	this.startX = x;
	this.direction = direction;
	this.hit = false;
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.call(this, game, this.x, this.y);
}

Cannonball.prototype = new Entity();
Cannonball.prototype.constructor = Cannonball;

Cannonball.prototype.update = function () {
	if (!this.hit) {
		this.x += this.game.clockTick * this.speed * this.direction;
		this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
		
		var distance = Math.abs(this.x - this.startX);
		if (distance > 900) {
			if (DEBUG) console.log("Cannonball removed.");	
			for( var i = 0; i < this.game.bulletsBad.length; i++){ 
				if ( this.game.bulletsBad[i] === this) {
					this.game.bulletsBad.splice(i, 1); 
					this.removeFromWorld = true;
				}
			}
		}
    }
	
    Entity.prototype.update.call(this);
}

Cannonball.prototype.draw = function () {
	if (this.hit) {
		this.animationExplosion.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		if (this.animationExplosion.isDone()) {
			for( var i = 0; i < this.game.bulletsBad.length; i++){ 
				if ( this.game.bulletsBad[i] === this) {
					this.game.bulletsBad.splice(i, 1);
					this.removeFromWorld = true;
				}
			}	
		}
		
	}
    else this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
    Entity.prototype.draw.call(this);
}