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
function Background(game, spritesheet, x, y, width, height, scale, speed, numberOfRepeats) {
    this.animation = new Animation(spritesheet, width, height, 1, 0.1, 1, true, scale);
	this.spritesheet = spritesheet;
    this.speed = speed;
    this.ctx = game.ctx;
	this.game = game;
	this.numberOfRepeats = numberOfRepeats;
    Entity.call(this, game, x, y, width, height, scale, speed, numberOfRepeats);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    if (this.game.Hero.moving) this.x -= this.game.clockTick * this.speed * this.game.Hero.direction;
    Entity.prototype.update.call(this);
}

Background.prototype.draw = function () {

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
    
	
	 if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.width*this.numberOfTiles, this.boundingbox.height);
		
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
    }

	
    Entity.prototype.draw.call(this);
}
TilePlatform.prototype.update = function () {
    Entity.prototype.update.call(this);
}


/*
Moving Platform
*/
function MovingPlatform(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    horizontal, startdirection, moveUnits, x, y, width, height, numberOfTiles) {
    this.ctx = game.ctx;
	this.game = game;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
	this.numberOfTiles = numberOfTiles;
    this.x = x;
    this.y = y;
	this.speed = 100;
    this.sourceXTopLeft = sourceXTopLeft;
    this.sourceYTopLeft = sourceYTopLeft;
    this.sourceXTopMid = sourceXTopMid;
    this.sourceYTopMid = sourceYTopMid;
    this.sourceXTopRight = sourceXTopRight;
    this.sourceYTopRight = sourceYTopRight;
	this.horizontal = horizontal;
	this.direction = startdirection;
	this.startDirection = startdirection;
	this.moveUnits = moveUnits;
	this.baseX = x;
	this.baseY = y;
    this.boundingbox = new BoundingBox(x, y, width*numberOfTiles, height);
    Entity.call(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    horizontal, startdirection, moveUnits, x, y, width, height, numberOfTiles);
}

MovingPlatform.prototype = new Entity();
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.update = function () {
			
	this.boundingbox = new BoundingBox(this.x, this.y, this.width*this.numberOfTiles, this.height);
	// horizontal
	if (this.horizontal) {
		this.x += this.game.clockTick * this.speed * this.direction;
		if (this.startDirection === 1) {
			if (this.x >= this.baseX + this.moveUnits*50) this.direction = -1;
			else if (this.x < this.baseX) this.direction = 1;	
		} else {
			if (this.x >= this.baseX) this.direction = -1;
			else if (this.x < this.baseX - this.moveUnits*50) this.direction = 1;
		}
		
	}
	// vertical 
	else {
		this.y += this.game.clockTick * this.speed * this.direction;
		
		if (this.startDirection === 1) {
			if (this.y >= this.baseY + this.moveUnits*50) this.direction = -1;
			else if (this.y < this.baseY) this.direction = 1;
		} else {
			if (this.y >= this.baseY) this.direction = -1;
			else if (this.y < this.baseY - this.moveUnits*50) this.direction = 1;
		}
		
	}
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	
    Entity.prototype.update.call(this);
}

MovingPlatform.prototype.draw = function () {
	
	for (var i=0; i < this.numberOfTiles; i++) {
		if (i === 0) {
			this.ctx.drawImage(this.spritesheet,
					this.sourceXTopLeft, this.sourceYTopLeft,  // source from sheet
					this.width, this.height,
					this.x - Camera.x, this.y,
					this.width, this.height);
		}
		else if (i < this.numberOfTiles - 1) {
			this.ctx.drawImage(this.spritesheet,
                     this.sourceXTopMid, this.sourceYTopMid,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y,
                     this.width, this.height);
		}
		else {
			this.ctx.drawImage(this.spritesheet,
                     this.sourceXTopRight, this.sourceYTopRight,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y,
                     this.width, this.height);
		}
	}

	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.x - Camera.x, this.y, this.width * this.numberOfTiles, this.height);
		this.ctx.strokeStyle = "green";
		this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
	
    Entity.prototype.draw.call(this);
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
Tile Platform
*/
function Platform(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles, numberOfTilesY) {
    this.ctx = game.ctx;
	this.game = game;
    this.spritesheet = spritesheet;
    this.width = width;
    this.height = height;
	this.numberOfTiles = numberOfTiles;
	this.numberOfTilesY = numberOfTilesY;
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
	// this.sourceXBotLeft = sourceXBotLeft;
	// this.sourceYBotLeft = sourceYBotLeft;
	// this.sourceXBotMid = sourceXBotMid;
	// this.sourceYBotMid = sourceYBotMid;
	// this.sourceXBotRight = sourceXBotRight;
	// this.sourceYBotRight = sourceYBotRight;
    this.boundingbox = new BoundingBox(x, y, width*numberOfTiles, height);
    Entity.call(game, spritesheet, sourceXTopLeft, sourceYTopLeft, sourceXTopMid, sourceYTopMid, sourceXTopRight, sourceYTopRight,
    sourceXLeft, sourceYLeft, sourceXMid, sourceYMid, sourceXRight, sourceYRight, x, y, width, height, numberOfTiles,numberOfTilesY);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.draw = function () {
	
    for (var y = 0; y < (this.numberOfTilesY*this.height); y+=this.height) {
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
                } 	else {
                    this.ctx.drawImage(this.spritesheet,
                     this.sourceXRight, this.sourceYRight,  // source from sheet
                     this.width, this.height,
                     this.x + (i * this.width) - Camera.x, this.y + y,
                     this.width, this.height);
                }
                
            }	
			
			// else if (y === (this.numberOfTilesY-1)*this.height) {
					// this.ctx.drawImage(this.spritesheet,
                        // this.sourceXBotLeft, this.sourceYBotLeft,  // source from sheet
                        // this.width, this.height,
                        // this.x - Camera.x, this.y + y,
                        // this.width, this.height);
				// }
        }
    }
    
	
	 if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.width*this.numberOfTiles, this.boundingbox.height);
		
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
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
	if (type === "shield" || type === "grenade" 
	|| type === "airstrike" || type === "1up" 
	|| type === "double" || type === "three-way"
	|| type === "checkpoint") this.animation = new Animation(spritesheet, width, height, 1, 0.5, 1, true, scale);
	else if (type === "exit") this.animation = new Animation(spritesheet, width, height, 8, 0.03, 32, true, scale);
	else this.animation = new Animation(spritesheet, width, height, 8, 0.08, 8, true, scale);
    this.ctx = game.ctx;
	this.game = game;
    this.spritesheet = spritesheet;
    this.width = width * scale;
    this.height = height * scale;
    this.x = x;
    this.y = y;
	this.basey = y;
	this.type = type;
    if (this.type === "exit") this.boundingbox = new BoundingBox(x+40, y+44, this.width/2 - 10, this.height/2);
	else this.boundingbox = new BoundingBox(x, y, this.width, this.height);
	this.floatHeight = 10;
	this.soundCoin = new Sound("audio/coin.wav");
	this.soundHealth = new Sound("audio/health.wav");
	this.soundShield = new Sound("audio/shield.wav");
	this.sound1Up = new Sound("audio/1up.wav");
	this.soundPowerUp = new Sound("audio/powerup.wav");
	this.soundCheckpoint = new Sound("audio/checkpoint.wav");
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
	if (this.type !== "exit" && this.type != "checkpoint") {
		height = (4 * duration - 4 * duration * duration) * this.floatHeight;
		this.y = this.basey - height;
	}
	if (this.type === "exit") this.boundingbox = new BoundingBox(this.x+40, this.y+44, this.width/2 - 10, this.height/2);
    else this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
	
	// check for hero collision
	if (this.boundingbox.collide(this.game.Hero.boundingbox)) {
		
		// health
		if (this.type === "health") {

			if (this.game.Hero.health <= this.game.Hero.maxHealth - 1) {
			
					if (DEBUG) console.log("Hero got " + this.type + " power up!");
					this.soundHealth.play();
					this.game.Hero.health++;
					this.removeFromWorld = true;
			}
		}
		// double
		else if (this.type === "double") {
			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.soundPowerUp.play();
			
			// no upgraded weapons
			if (this.game.Hero.weapons.length === 1) {
				this.game.Hero.weapons.push("double");
				this.game.Hero.ammoDouble += 10; 
				this.game.Hero.weaponsIndex++;
			} 
			// increment ammo
			else {
				for (var i = 0; i < this.game.Hero.weapons.length; i++) {
					if (this.game.Hero.weapons[i] === "double") {
						this.game.Hero.ammoDouble += 10; 
						break;
					}
					if (i === this.game.Hero.weapons.length-1) {
						this.game.Hero.weapons.push("double");
					}
				}
			}
		
			this.removeFromWorld = true;
		}
		// three-way
		else if (this.type === "three-way") {
			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.soundPowerUp.play();
			
			// no upgraded weapons
			if (this.game.Hero.weapons.length === 1) {
				this.game.Hero.weapons.push("three-way");
				this.game.Hero.ammoThreeWay += 10; 
				this.game.Hero.weaponsIndex++;
			} 
			// increment ammo
			else {
				for (var i = 0; i < this.game.Hero.weapons.length; i ++) {
					if (this.game.Hero.weapons[i] === "three-way") {
						this.game.Hero.ammoThreeWay += 10; 
						break;
					}
					if (i === this.game.Hero.weapons.length-1) {
						this.game.Hero.weapons.push("three-way");
					}
				}
			}
			this.removeFromWorld = true;
		}
		else if (this.type === "1up") {

			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.sound1Up.play();
			if(this.game.Hero.lives < 3) this.game.Hero.lives++;
			this.removeFromWorld = true;
			
		}
		else if (this.type === "coin") {

			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.game.Hero.coins++;
			this.soundCoin.play();
			this.removeFromWorld = true;
			
		}
		else if (this.type === "shield") {

			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.game.Hero.shield += 3;
			this.soundShield.play();
			this.removeFromWorld = true;
			
		}
		else if (this.type === "grenade") {

			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.soundPowerUp.play();
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
		else if (this.type === "airstrike") {

			if (DEBUG) console.log("Hero got " + this.type + " power up!");
			this.soundPowerUp.play();
			// no specials
			if (this.game.Hero.specials.length === 0) {
				this.game.Hero.specials.push("airstrike");
				this.game.Hero.airstrikes++; 
			} 
			// increment airstrikes
			else {
				// alert("in here");
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
		else if (this.type === "exit") {

			if (DEBUG) console.log("Hero got " + this.type + " power up!");			
			this.soundExit.play();
			this.removeFromWorld = true;
			this.game.level++;
			if (this.game.level > 3) {  // game won code
				this.game.gameWon = true;
				this.game.shop = false;
				this.game.Hero.visible = false;
				this.game.checkPoint = false;
				this.game.level = 1;
				if (soundSong) soundSong.stop();
				soundSong = new Sound(levelSong.win);
				soundSong.sound.loop = true;
				soundSong.play();
				resetHeroCheckPoint();
				resetGame();
				
			} else {
				resetHeroCheckPoint();
				this.game.Hero.visible = false;
				this.game.shop = true;
				this.game.checkPoint = false;
				this.game.endLevel = true;
				soundSong.stop();
				soundShopTheme.play();
				resetGame();
				
			}
			
		}
		else if (this.type === "checkpoint") {
			// ADD CODE HERE TO MAKE THIS LOCATION THE CHECKPOINT
			this.soundCheckpoint.play();
			this.removeFromWorld = true;
			if (!this.game.checkPoint) {
				saveHeroData();
				// heroCheckPoint.x = this.game.Hero.x;
				// heroCheckPoint.y = this.game.Hero.y;
				// heroCheckPoint.cameraX = Camera.x;
				// heroCheckPoint.coins = this.game.Hero.coins;
				// heroCheckPoint.score = this.game.Hero.score;
				// heroCheckPoint.specials = Array.from(this.game.Hero.specials);
				// heroCheckPoint.airstrikes = this.game.Hero.airstrikes;
				// heroCheckPoint.grenades = this.game.Hero.grenades;
				// heroCheckPoint.weapons = Array.from(this.game.Hero.weapons);
				// heroCheckPoint.ammoDouble = this.game.Hero.ammoDouble;
				// heroCheckPoint.ammoThreeWay = this.game.Hero.ammoThreeWay;
				// alert(heroCheckPoint.specials);
			}
			this.game.checkPoint = true;
			
		}
		
	}
		
	Entity.prototype.update.call(this);
}

PowerUp.prototype.draw = function () {
	
	if (this.type !== "1up") this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	else this.ctx.drawImage(AM.getAsset("./img/hero.png"), 24, 143, 50, 50, this.x - Camera.x, this.y, 35, 35);
	
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
Aiming Turret
*/
function AimTurret(game, spritesheet, x, y, width, height, powerUp, powerUpType) {
	//CustomAnimation(spriteSheet, startX, startY, offset, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
		
    this.animation = new CustomAnimation(spritesheet, 627, 211, 0, width, height, 1, 0.5, 1, false, 1);
	this.animationShoot = new CustomAnimation(spritesheet, 627, 211, 0, width, height, 1, 1.75, 1, false, 1);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 0.4);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.hitPoints = 3;
    this.active = false;
    this.powerUp = powerUp;
    this.powerUpType = powerUpType;
    this.shooting = true;
	this.soundDeath = new Sound("audio/death-enemy.wav");
    this.boundingbox = new BoundingBox(x, y+20, width, height);
    Entity.call(game, spritesheet, x, y, width, height, powerUp, powerUpType);
}

AimTurret.prototype = new Entity();
AimTurret.prototype.constructor = AimTurret;

AimTurret.prototype.update = function () {
    // monster dead
    if (this.animationDie.isDone()) {
        this.game.Hero.score += 350;
        // drop powerUp
        if (this.powerUp) dropPowerUp(this);
    }

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
					
					var bullet = new AimCannonball(this.game, this.x - 7, this.y + 29, -1, " 1 ");
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

AimTurret.prototype.draw = function () {

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
			this.animationShoot.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y+20);
		} else {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y+20);
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
Orb
*/
function Orb(game, x, y, orbType) {

    if (orbType === "purple") this.animation = new CustomAnimation(AM.getAsset("./img/orbs.png"), 0, 128, 0, 32, 32, 4, 0.1, 4, true, 1);
    else if (orbType === "blue") this.animation = new CustomAnimation(AM.getAsset("./img/orbs.png"), 0, 64, 0, 32, 32, 4, 0.1, 4, true, 1);
	//else this.animation = new CustomAnimation(AM.getAsset("./img/orbs.png"), 0, 128, 0, 32, 32, 4, 0.1, 4, true, 1);
	this.animationExplosion = new CustomAnimation(AM.getAsset("./img/explosions.png"), 641, 367, 5, 15, 15, 6, .05, 6, false, 1);
    this.speed = 250;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.xVelocity = 0;
	this.yVelocity = 0
	this.calculateVelocity();
	this.width = 12;
	this.height = 12;
	this.startX = x;
	this.hit = false;
	this.sound = new Sound("audio/cannon.wav");
	this.sound.play();
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.call(this, game, this.x, this.y, orbType);
}

Orb.prototype = new Entity();
Orb.prototype.constructor = Orb;

Orb.prototype.calculateVelocity = function() {
	// Tommy Edit
	var x = this.game.Hero.x+20 - this.x;
	var y = this.game.Hero.y+25 - this.y;
	var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	this.xVelocity = x / distance;
	this.yVelocity = y / distance;
	
}

Orb.prototype.update = function () {
	if (!this.hit) {
		
		// Tommy edit
		this.x += this.xVelocity * this.game.clockTick * this.speed;
		this.y += this.yVelocity * this.game.clockTick * this.speed;

		
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

Orb.prototype.draw = function () {
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
	
	
/*
Aim/Smart Cannonball
*/
function AimCannonball(game, x, y, direction) {


    this.animation = new CustomAnimation(AM.getAsset("./img/robots.png"), 162, 187, 0, 6, 6, 1, 1, 1, true, 2);
    this.animationExplosion = new CustomAnimation(AM.getAsset("./img/explosions.png"), 641, 367, 5, 15, 15, 6, .05, 6, false, 1);
    this.speed = 250;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.xVelocity = 0;
	this.yVelocity = 0
	this.calculateVelocity();
	this.width = 12;
	this.height = 12;
	this.startX = x;
	this.direction = direction;
	this.hit = false;
	this.sound = new Sound("audio/cannon.wav");
	if (this.x > Camera.x && this.x < Camera.x + 900) this.sound.play();
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.call(this, game, this.x, this.y);
}

AimCannonball.prototype = new Entity();
AimCannonball.prototype.constructor = AimCannonball;

AimCannonball.prototype.calculateVelocity = function() {
	// Tommy Edit
	var x = this.game.Hero.x+20 - this.x+6;
	var y = this.game.Hero.y+25 - this.y+6;
	var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	this.xVelocity = x / distance;
	this.yVelocity = y / distance;
	
	/*var x = Math.abs(this.game.Hero.x - this.x);
	var y = Math.abs(this.game.Hero.y - this.y);
	var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	
	if (this.game.Hero.x < this.x && this.game.Hero.y > this.y) { // turret above, and right to hero
		this.xVelocity = (this.x - this.game.Hero.x) / distance; 
		this.yVelocity = (this.game.Hero.y - this.y) / distance;
		this.leftDownDiagonalShoot = true; 
	} else if (this.x < this.game.Hero.x && this.game.Hero.y > this.y) { // turret above, and left to hero
		this.xVelocity = (this.game.Hero.x - this.x) / distance; 
		this.yVelocity = (this.game.Hero.y - this.y) / distance;
		this.rightDownDiagonalShoot = true; 
	} else if (this.y > this.game.Hero.y && this.x > this.game.Hero.x) { // turret below, right to hero
		this.xVelocity = Math.abs(this.x - this.game.Hero.x) / distance; 
		this.yVelocity = Math.abs(this.game.Hero.y - this.y) / distance;
		this.leftUpDiagonalShoot = true; 
	} else if (this.y > this.game.Hero.y && this.x < this.game.Hero.x) { // turret below left to hero
		this.xVelocity = Math.abs(this.x - this.game.Hero.x) / distance; 
		this.yVelocity = Math.abs(this.game.Hero.y - this.y) / distance;
		this.rightUpDiagonalShoot = true; 
	} else if (this.game.Hero.x > this.x) {
		this.xVelocity = (this.game.Hero.x - this.x) / distance; 
		this.rightShoot = true;
	} else if (this.game.Hero.x < this.x) {
		this.xVelocity = (this.x - this.game.Hero.x) / distance; 
		this.leftShoot = true;
	}
	*/
	
}

AimCannonball.prototype.update = function () {
	if (!this.hit) {
		
		// Tommy edit
		this.x += this.xVelocity * this.game.clockTick * this.speed;
		this.y += this.yVelocity * this.game.clockTick * this.speed;
		/*
		if (this.leftDownDiagonalShoot) {
			this.x -= this.xVelocity * this.game.clockTick * this.speed;
			this.y += this.yVelocity * this.game.clockTick * this.speed;			
		} else if (this.rightDownDiagonalShoot) {
			this.x += this.xVelocity * this.game.clockTick * this.speed;
			this.y += this.yVelocity * this.game.clockTick * this.speed;
		} else if (this.leftUpDiagonalShoot) {
			this.x -= this.xVelocity * this.game.clockTick * this.speed;
			this.y -= this.yVelocity * this.game.clockTick * this.speed;
		} else if (this.rightUpDiagonalShoot) {
			this.x += this.xVelocity * this.game.clockTick * this.speed;
			this.y -= this.yVelocity * this.game.clockTick * this.speed;
		} else if (this.leftShoot) {
			this.x -= this.xVelocity * this.game.clockTick * this.speed;
		} else if (this.rightShoot) {
			this.x += this.xVelocity * this.game.clockTick * this.speed;
		}
		*/
		
		this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
		
		var distance = Math.abs(this.x - this.startX);
		if (distance > 600) {
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

AimCannonball.prototype.draw = function () {
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
	this.exitX = x;
	this.exitY = y;
	this.soundDeath = new Sound("audio/death-enemy.wav");
	this.soundVictory = new Sound("audio/victory.mp3");
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
        
		this.exitX = this.x;
		this.exitY = this.boundingbox.bottom - 111;
		// drop powerUp
        if (this.powerUp) dropPowerUp(this);
    }

	// alive
    if (this.hitPoints > 0) {
		// draw health bar
		
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
		if (this.animationDie.elapsedTime === 0) {
			this.soundDeath.play();
			this.soundVictory.play();
		}

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
		// draw health bar
		if (this.active) {
			this.ctx.fillStyle = 'red';
			this.ctx.fillRect(150, 100, (500/16) * this.hitPoints, 25);
		}
		
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
Boss2
*/
function Boss2(game, spritesheet, x, y, width, height, scale, powerUp, powerUpType) {
	this.animationLeft = new CustomAnimation(spritesheet, 0, 64, 0, 64, 64, 3, 0.15, 3, true, scale);
	this.animationRight = new CustomAnimation(spritesheet, 0, 128, 0, 64, 64, 3, 0.15, 3, true, scale);
	this.animationFront = new CustomAnimation(spritesheet, 0, 0, 0, 64, 64, 3, 0.15, 3, true, scale);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 1);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
    this.width = (width-22) * scale;
    this.height = (height-50) * scale;
    this.speed = 250;
    this.x = x;
    this.y = y;
	this.exitX = 10350;
	this.exitY = 390;
	this.baseX = x;
	this.baseY = y;
    this.hitPoints = 20;
    this.active = false;
	this.moveUp = true;
	this.moveLeft = false;
	this.Down = false;
	this.moveRight = false;
	this.shootElapsedTime = 0;
    this.powerUp = powerUp;
    this.powerUpType = powerUpType;
	this.soundDeath = new Sound("audio/death-enemy.wav");
	this.soundVictory = new Sound("audio/victory.mp3");
    this.boundingbox = new BoundingBox(x, y+7, this.width, this.height);
    Entity.call(game, spritesheet, x, y, width, height, scale, powerUp, powerUpType);
}

Boss2.prototype = new Entity();
Boss2.prototype.constructor = Boss2;

Boss2.prototype.update = function () {
	this.shootElapsedTime += this.game.clockTick;
    this.boundingbox = new BoundingBox(this.x, this.y+7, this.width, this.height);
	
	// alive
    if (this.hitPoints > 0) {
		if (this.x - this.game.Hero.x < 325) {
			this.active = true;
		}
		
		if (this.active) {
			// shoot
			if (this.shootElapsedTime > 1.35) {
				var bullet = new Orb(this.game, this.x +this.width/2, this.y + this.height/2, "purple");
				this.game.addEntity(bullet);
				this.game.bulletsBad.push(bullet);
				this.shootElapsedTime = 0;
			}

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
	
			// Move up
			if (this.moveUp) {
				var moveTick = Math.round(this.game.clockTick * this.speed);
				this.y -= moveTick;
				
				// move done
				if ( this.y < this.baseY - 350 ) {
					this.animationFront.elapsedTime = 0;
					this.animationRight.elapsedTime = 0;
					this.animationLeft.elapsedTime = 0;
					
					this.moveUp = false;
					this.moveLeft = true;
				}
			}
			
			// Move left
			else if (this.moveLeft) {
				var moveTick = Math.round(this.game.clockTick * this.speed);
				this.x -= moveTick;
				
				// move done
				if ( this.x < this.baseX - 650  ) {
					this.animationFront.elapsedTime = 0;
					this.animationRight.elapsedTime = 0;
					this.animationLeft.elapsedTime = 0;
					
					this.moveLeft = false;
					this.moveDown = true;
				}
			}
			
			// Move down
			else if (this.moveDown) {
				var moveTick = Math.round(this.game.clockTick * this.speed);
				this.y += moveTick;
				
				// move done
				if ( this.y > this.baseY  ) {
					this.animationFront.elapsedTime = 0;
					this.animationRight.elapsedTime = 0;
					this.animationLeft.elapsedTime = 0;
					
					this.moveDown = false;
					this.moveRight = true;
				}
			}
			
			// Move right
			else {
				var moveTick = Math.round(this.game.clockTick * this.speed);
				this.x += moveTick;
				
				// move done
				if ( this.x > this.baseX ) {
					this.animationFront.elapsedTime = 0;
					this.animationRight.elapsedTime = 0;
					this.animationLeft.elapsedTime = 0;
					
					this.moveRight = false;
					this.moveUp = true;
				}
			}
			
		}	
	}
	
	// monster dead
    else {
		
		if (this.animationDie.isDone()) {
			this.game.Hero.score += 2000;
			
			// drop powerUp
			if (this.powerUp) dropPowerUp(this);
			
			for( var i = 0; i < this.game.monsters.length; i++){ 
				if ( this.game.monsters[i] === this) {
					this.game.monsters.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		

    }
    
		
    Entity.prototype.update.call(this);
}

Boss2.prototype.draw = function () {
	
	// dead	
	if (this.hitPoints <= 0) {
		if (this.animationDie.elapsedTime === 0) {
			this.soundDeath.play();
			this.soundVictory.play();
		}
		this.animationDie.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);		
		
	// alive
	} else {
		// draw health bar
		if (this.active) {
			this.ctx.fillStyle = 'red';
			this.ctx.fillRect(150, 100, (500/20) * this.hitPoints, 25);
		}
	
		if (this.moveUp || this.moveDown) this.animationFront.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		else if (this.moveLeft) this.animationLeft.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		else if (this.moveRight) this.animationRight.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	}
	
    if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
    }
}

/*
Boss3
*/
function Boss3(game, spritesheet, x, y, width, height, scale, powerUp, powerUpType) {
	this.animation = new Animation(spritesheet, width, height, 4, 0.1, 8, true, scale);
//spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 1);
    this.ctx = game.ctx;
    this.spritesheet = spritesheet;
    this.game = game;
    this.width = (width) * scale;
    this.height = (height) * scale;
    this.speed = 150;
    this.x = x;
    this.y = y;
	this.exitX = 12100;
	this.exitY = 390;
	this.baseY = y;
    this.hitPoints = 20;
    this.active = false;
	this.direction = -1;
	this.shootElapsedTime = 0;
	this.batElapsedTime = 0;
    this.powerUp = powerUp;
    this.powerUpType = powerUpType;
	this.soundDeath = new Sound("audio/death-enemy.wav");
	this.soundVictory = new Sound("audio/victory.mp3");
    this.boundingbox = new BoundingBox(x, y+7, this.width, this.height);
    Entity.call(game, spritesheet, x, y, width, height, scale, powerUp, powerUpType);
}

Boss3.prototype = new Entity();
Boss3.prototype.constructor = Boss2;

Boss3.prototype.update = function () {
	
    this.boundingbox = new BoundingBox(this.x, this.y+7, this.width, this.height);
	
	// alive
    if (this.hitPoints > 0) {
		if (this.x - this.game.Hero.x < 325) {
			this.active = true;
		}
		
		if (this.active) {
			this.shootElapsedTime += this.game.clockTick;
			this.batElapsedTime += this.game.clockTick;
			
			// shoot
			if (this.shootElapsedTime > 1.75) {
				var bullet = new Orb(this.game, this.x +this.width/2, this.y + this.height/2, "blue");
				this.game.addEntity(bullet);
				this.game.bulletsBad.push(bullet);
				this.shootElapsedTime = 0;
			}
			
			// bat
			if (this.batElapsedTime > 4) {
				var bat = new Bat(gameEngine, this.x, this.y, 2);
				this.game.addEntity(bat);
				this.game.monsters.push(bat);
				this.batElapsedTime = 0;
			}

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
	
			// move
			var moveTick = Math.round(this.game.clockTick * this.speed * this.direction);
			this.y += moveTick;
			
			// change direction
			if (this.y < this.baseY - 300) this.direction = 1;
			else if (this.y > this.baseY) this.direction = -1;
			
		}	
	}
	
	// monster dead
    else {
		
		if (this.animationDie.isDone()) {
			this.game.Hero.score += 2000;
			
			// drop powerUp
			if (this.powerUp) dropPowerUp(this);
			
			for( var i = 0; i < this.game.monsters.length; i++){ 
				if ( this.game.monsters[i] === this) {
					this.game.monsters.splice(i, 1);				
					this.removeFromWorld = true;
				}
			}	
		}
		

    }
    
		
    Entity.prototype.update.call(this);
}

Boss3.prototype.draw = function () {
	
	// dead	
	if (this.hitPoints <= 0) {
		if (this.animationDie.elapsedTime === 0) {
			this.soundDeath.play();
			this.soundVictory.play();
		}
		this.animationDie.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);		
		
	// alive
	} else {
		// draw health bar
		if (this.active) {
			this.ctx.fillStyle = 'red';
			this.ctx.fillRect(150, 100, (500/20) * this.hitPoints, 25);
		}
	
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
	
	}
	
    if (DEBUG) {
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.x - Camera.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.boundingbox.left - Camera.x, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
    }
}

/*
Bat
*/
function Bat(game, x, y, scale) {
    this.animation = new CustomAnimation(AM.getAsset("./img/bat.png"), 32, 0, 0, 32, 32, 3, .15, 3, true, scale);
	this.animationDie = new Animation(AM.getAsset("./img/explosion.png"), 128, 128, 4, 0.03, 16, false, 0.4);
    this.speed = 100;
    this.ctx = game.ctx;
	this.game = game;
    this.x = x;
    this.y = y;
	this.width = 32*scale;
	this.height = 32*scale;
	this.xVelocity = 0;
	this.yVelocity = 0;
	this.hitPoints = 3;
	this.hit = false;
	this.soundDeath = new Sound("audio/death-enemy.wav");
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.call(this, game, this.x, this.y);
}

Bat.prototype = new Entity();
Bat.prototype.constructor = Bat;

Bat.prototype.update = function () {
	
	if (!this.hit) {
		
		
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
			this.hitPoints = 0;
		}

		
		this.calculateVelocity();
		this.x += this.xVelocity * this.game.clockTick * this.speed;
		this.y += this.yVelocity * this.game.clockTick * this.speed;
		
		this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    }
	
    Entity.prototype.update.call(this);
}

Bat.prototype.draw = function () {

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
	} else this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - Camera.x, this.y);
		
	    Entity.prototype.draw.call(this);
}


Bat.prototype.calculateVelocity = function() {
	// Tommy Edit
	var x = this.game.Hero.x - this.x;
	var y = this.game.Hero.y - this.y;
	var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	this.xVelocity = x / distance;
	this.yVelocity = y / distance;
	
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
	this.ammoDouble = 0;
	this.ammoThreeWay = 0;
	this.specials = [];
	this.currentSpecial = "";
	this.lives = 3;
	this.weapons = [];
	this.weapons.push("basic");
//	this.weapons.push("three-way");
	this.weaponsIndex = 0;
	this.weapon = "basic";
	this.weaponDamage = 1;
	this.soundDamage = new Sound("audio/damage.wav");
	this.soundJump = new Sound("audio/jump.wav");
    this.boundingbox = new BoundingBox(this.x+2, this.y+2, this.width-7, this.height);
	this.visible = true;
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
	this.visible = true;
	this.currentSpecial = "";

}

Soldier.prototype.update = function () {
	if (!this.visible) return;
	this.shootElapsedTime += this.game.clockTick;
	this.specialElapsedTime += this.game.clockTick;
	this.hitElapsedTime += this.game.clockTick;
	this.lastboundingbox = this.boundingbox;
	this.lastBottom = this.boundingbox.bottom;
	
	if (this.specials.length > 0) this.currentSpecial = this.specials[this.specialsIndex];
	else this.currentSpecial = "";

	if (this.weapons.length > 1) this.weapon = this.weapons[this.weaponsIndex];
	else this.weapon = "basic";
	if (this.weapon === "double") this.weaponDamage = 2;
	else this.weaponDamage = 1;
	
	
	if (this.health <= 0) {
		
		this.lives--;
		this.health = this.maxHealth;
		if (this.lives > 0) loadCheckPoint();
		
	}
	
	
	if (this.lives <= 0) {
		soundGameOver.play();
		this.game.gameOver = true;
		this.game.level = 1;
		resetGame();
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

	// moving platform
	if (!this.falling && !this.jumping) {
		for (var i = 0; i < this.game.movplatforms.length; i++) {
			var plat = this.game.movplatforms[i];
			if (this.platform === plat) {

					if (plat.horizontal) this.x += Math.round(this.game.clockTick * plat.speed * plat.direction);
					else this.y = plat.boundingbox.top - this.height;	
				

					// adjust camera
					var moveTick = Math.round(this.game.clockTick * plat.speed * plat.direction);
					if (!Camera.lock) {
						if ((Camera.x + moveTick >= 0 && this.x - Camera.x >= 400 && plat.direction === 1) 
							|| (Camera.x + moveTick >= 0 && this.x - Camera.x <= 400 && plat.direction === -1) ) Camera.x += moveTick;		
					}			
				
				
				
				if (this.direction === 1) this.boundingbox = new BoundingBox(this.x+14, this.y, this.width-13, this.height);
				else this.boundingbox = new BoundingBox(this.x+5, this.y, this.width-17, this.height);
				
				break;
			
			}
		
		}
	}
	
    // moving
    if (this.moving) {
		if (this.direction === 1) this.boundingbox = new BoundingBox(this.x+14, this.y, this.width-13, this.height);
		else this.boundingbox = new BoundingBox(this.x+5, this.y, this.width-17, this.height);

		// move hero
		var moveTick = Math.round(this.game.clockTick * this.speed * this.direction);
		if (this.x + moveTick >= -5 && this.x + moveTick <= Camera.max) this.x += moveTick;
		
		// lock camera at boss
		if (!Camera.lock && Camera.x >= Camera.max - 750) {
			Camera.lock = true;
			Camera.x = Camera.max - 750;
		}
		
		// adjust camera
		if (!Camera.lock) {
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
			
			if (this.weapon === "double") {
				this.ammoDouble--;
					
					// no more ammo
					if (this.ammoDouble <= 0 ) {
						
						this.weapon = this.weapon[this.weaponsIndex-1];
						this.weapons.splice(this.weaponsIndex, 1);
						if (this.weaponsIndex === this.weapons.length && this.weapons.length > 0) this.weaponsIndex -= 1;
					}
			}
			
			if (this.weapon === "three-way") {
				this.ammoThreeWay--;
				var bullet = new Bullet(this.game, AM.getAsset("./img/bullet.png"), this.x + compensate, this.y + compensateY, this.direction, -1);
				this.game.addEntity(bullet);
				this.game.bullets.push(bullet);
				
				var bullet = new Bullet(this.game, AM.getAsset("./img/bullet.png"), this.x + compensate, this.y + compensateY, this.direction, 1);
				this.game.addEntity(bullet);
				this.game.bullets.push(bullet);
				
				// no more ammo
				if (this.ammoThreeWay <= 0 ) {
					
					this.weapon = this.weapon[this.weaponsIndex-1];
					this.weapons.splice(this.weaponsIndex, 1);
					if (this.weaponsIndex === this.weapons.length && this.weapons.length > 0) this.weaponsIndex -= 1;
				}
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
						if (this.specialsIndex === this.specials.length && this.specials.length > 0) this.specialsIndex -= 1;
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
						if (this.specialsIndex === this.specials.length && this.specials.length > 0) this.specialsIndex -= 1;
					}

					// reset cooldown
					this.specialElapsedTime = 0;
				}
			}

			//console.log("index: " + this.specialsIndex);
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
				// alert("landed");
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

        //this.lastBottom = this.boundingbox.bottom;
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
		
		
		this.health = 0;
		// this.game.shop = true;
		this.y = -50;
	}
    Entity.prototype.update.call(this);
}

Soldier.prototype.draw = function () {
	if (!this.visible) return;
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
	
	// Level
	this.ctx.font = "bold 30px Arial";
	this.ctx.lineWidth = 5;
	this.ctx.strokeText("Level: " + this.game.level, 350, 30);
	this.ctx.fillStyle = "white";
	this.ctx.fillText("Level: " + this.game.level, 350, 30);
	
	// Score
	this.ctx.lineWidth = 5;
	if (this.score === 0) this.ctx.strokeText("Score: " + this.score, 675, 30);
	else this.ctx.strokeText("Score: " + this.score, 675 - ((Math.log10(this.score) + 1) * 12), 30);
	this.ctx.fillStyle = "white";
	if (this.score === 0) this.ctx.fillText("Score: " + this.score, 675, 30);
	else this.ctx.fillText("Score: " + this.score, 675 - ((Math.log10(this.score) + 1) * 12), 30);
	
	// Lives
	this.ctx.drawImage(AM.getAsset("./img/hero.png"), 24, 143, 50, 50, 0, 0, 50, 50);
	this.ctx.font = "bold 15px Arial";
	this.ctx.lineWidth = 2;
	this.ctx.strokeText("x"+this.lives, 40, 50);
	this.ctx.fillStyle = "white";
	this.ctx.fillText("x"+this.lives, 40, 50);	
	this.ctx.lineWidth = 1;
	this.ctx.font = "bold 30px Arial";
    // Health
	for (var i = 0; i < this.maxHealth; i++) {
	    if (i < this.health) this.ctx.drawImage(AM.getAsset("./img/heart.png"), 50 + (i * 35), 10, 35, 35);
	    else this.ctx.drawImage(AM.getAsset("./img/heartEmpty.png"), 50 + (i * 35), 10, 35, 35);
	}
	

	// Shield
	for (var i = 0; i < this.shield; i++) this.ctx.drawImage(AM.getAsset("./img/PowerUp/shield.png"), 50 + (this.maxHealth * 35) + (i * 35), 10, 35, 35);
	

	// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	
	// Coins
	
	if (this.coins === 0) this.ctx.drawImage(AM.getAsset("./img/PowerUp/coinIcon.png"), 730, 40, 35, 35);
	else {
		this.ctx.drawImage(AM.getAsset("./img/PowerUp/coinIcon.png"), 740 - (Math.log10(this.coins) + 1) * 10, 40, 35, 35);
		this.ctx.shadowColor = "black";
		this.ctx.shadowBlur = 7;
		this.ctx.lineWidth = 5;
		this.ctx.strokeText(this.coins, 785 - (Math.log10(this.coins) + 1) * 10, 70);	
		this.ctx.shadowBlur = 0;
		this.ctx.fillStyle = "white";
		this.ctx.fillText(this.coins, 785 - (Math.log10(this.coins) + 1) * 10, 70);	
	}

	// Weapons
	this.ctx.drawImage(AM.getAsset("./img/weaponBackground.png"), 145, 0, 148, 106, 0, 50, 79, 53);
	this.ctx.drawImage(AM.getAsset("./img/weaponBackground.png"), 0, 0, 148, 106, 80, 50, 79, 53);
	if (this.weapon === "basic") this.ctx.drawImage(AM.getAsset("./img/bullet.png"), 0, 0, 14, 14, 20, 55, 42, 42);
	else if (this.weapon === "double") {
		this.ctx.drawImage(AM.getAsset("./img/bullet2.png"), 0, 0, 14, 14, 20, 55, 42, 42);
	
		this.ctx.font = "bold 15px Arial";
		this.ctx.lineWidth = 2;
		this.ctx.strokeText("x"+this.ammoDouble, 52, 92);
		this.ctx.fillStyle = "white";
		this.ctx.fillText("x"+this.ammoDouble, 52, 92);
		this.ctx.lineWidth = 1;
		this.ctx.font = "bold 30px Arial";
	
	}
	else if (this.weapon === "three-way") {
		
		this.ctx.drawImage(AM.getAsset("./img/PowerUp/three-way.png"), 0, 0, 27, 19, 13, 58, 54, 38);

		this.ctx.font = "bold 15px Arial";
		this.ctx.lineWidth = 2;
		this.ctx.strokeText("x"+this.ammoThreeWay, 52, 92);
		this.ctx.fillStyle = "white";
		this.ctx.fillText("x"+this.ammoThreeWay, 52, 92);
		this.ctx.lineWidth = 1;
		this.ctx.font = "bold 30px Arial";
	
	}
	
	if (this.specials.length > 0) {
		
		this.ctx.font = "bold 15px Arial";
		
		// grenades
		if (this.currentSpecial === "grenade") {
			this.ctx.drawImage(AM.getAsset("./img/PowerUp/grenade.png"), 0, 0, 512, 512, 105, 61, 30, 30);
			this.ctx.fillText(this.grenades, 137, 92);
		}
		
		// air strikes
		else if (this.currentSpecial === "airstrike") {
			this.ctx.drawImage(AM.getAsset("./img/PowerUp/jet.png"), 0, 0, 825, 333, 95, 65, 50, 20);
			this.ctx.fillText(this.airstrikes, 137, 92);
		}
		
		this.ctx.font = "bold 30px Arial";
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
		this.y -= this.game.clockTick * this.speed * this.aimY/1.5;
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
	this.sound = new Sound("audio/jet.wav");
	this.sound.play();
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
	if (this.x > Camera.x + 800) {
		//this.sound.stop();
		this.removeFromWorld = true;
	}
	
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
	this.sound = new Sound("audio/cannon.wav");
	if (this.x > Camera.x && this.x < Camera.x + 900) this.sound.play();
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