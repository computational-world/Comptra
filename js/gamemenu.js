/*
Game Shop
*/
function GameShop(game, spritesheet) {
	this.width = spritesheet.width;
	this.height = spritesheet.height;
	this.animation =  new Animation(spritesheet, this.width, this.height, 1, 0.5, 1, true, 1.2);
	this.pointerX = 20;
	this.offset = 50;
	this.item1 = new ShopItem(game, AM.getAsset("./img/PowerUp/grenade.png"), 430, 95, 35, 35, 0, 1, "Grenade");
	this.item2 = new ShopItem(game, AM.getAsset("./img/PowerUp/shield.png"), 430, 95, 35, 35, 50, 2, "Shield");
	this.item3 = new ShopItem(game, AM.getAsset("./img/PowerUp/jet.png"), 430, 95, 35, 35, 100, 4, "Airstrike");
	this.item4 = new ShopItem(game, AM.getAsset("./img/bullet2.png"), 430, 95, 35, 35, 150, 5, "x2 Damage");
	this.items = [];
	this.addItemToShop();
	this.pointerY = -25;
	this.boundedTop = -25;
	this.basey = this.pointerY;
	this.floatHeight = 10;
	this.moveDown = false;
	this.moveUp = false;
	this.purchaseFail = false;
	this.game = game;
	this.soundPurchase = new Sound("audio/Shop/purchase.mp3");
	this.soundMove = new Sound("audio/Shop/move.wav");
	this.soundError = new Sound("audio/Shop/error.wav");
}

GameShop.prototype = new Entity();
GameShop.prototype.constructor = GameShop;

GameShop.prototype.addItemToShop = function() {
	this.items.push(this.item1);
	this.items.push(this.item2);
	this.items.push(this.item3);
	this.items.push(this.item4);
	this.items.push(gameEngine.continueButton);
}

GameShop.prototype.purchaseItem = function() {
	this.hasAttemptPurchase = true;
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		// alert(this.basey);
		if (item.offset + this.boundedTop === this.basey) {
			if (item.type === "Shield" && this.game.Hero.coins >= item.price) {
				this.soundPurchase.play();
				this.game.Hero.shield = 3;
				this.game.Hero.coins -= item.price;
			} else if (item.type === "Grenade" && this.game.Hero.coins >= item.price) {
				this.soundPurchase.play();
				if (this.hasSpecial("grenade")) this.game.Hero.grenades++;
				else {
					this.game.Hero.specials.push("grenade");
					this.game.Hero.grenades++;
				}
				this.game.Hero.coins -= item.price;
			} else if (this.game.Hero.coins < item.price) {
				this.soundError.play();
				this.purchaseFail = true;
			} 
			break;
		} else if (item instanceof ContinueButton && this.basey === 225) {
			nextLevel();
		}
	}
	
}

GameShop.prototype.hasSpecial = function(type) {
	for (var i = 0; i < this.game.Hero.specials.length; i++) {
		if (this.game.Hero.specials[i] === type) return true;
	}
	return false;
}

GameShop.prototype.update = function () {
	// if (this.purchaseFail) this.purchaseFail = false;
	if (this.moveDown) {
		this.pointerY = this.basey + this.offset;
		this.basey = this.pointerY;
		this.moveDown = false;
		this.soundMove.play();
		
	} else if (this.moveUp) {
		var newY = this.basey - this.offset;
		
		if (newY >= this.boundedTop) {
			this.pointerY = newY;
			this.basey = this.pointerY;
		}
		this.moveUp = false;
		this.soundMove.play();
	}
	var duration = this.animation.elapsedTime + this.game.clockTick;
	if (duration > this.animation.totalTime / 2) duration = this.animation.totalTime - duration;
	duration = duration / this.animation.totalTime;
	var height = (4 * duration - 4 * duration * duration) * this.floatHeight;
	this.pointerY = this.basey - height;
    Entity.prototype.update.call(this);
}

GameShop.prototype.draw = function () {
	if (this.game.shop) {
		// alert("I am here");
		this.game.ctx.fillStyle = "#0a0a0a";
		roundRect(this.game.ctx, 0, 0, 800, 800, 5, true, true);
		this.game.ctx.fillStyle = "#6AE1F5";
		this.game.ctx.font = "30px Verdana";
		this.game.ctx.fillText("Game Shop", 320, 30);
		
		// coins
		this.game.ctx.fillStyle = "#ffffff";
		this.game.ctx.font = "25px Verdana";
		this.game.ctx.drawImage(AM.getAsset("./img/PowerUp/coinIcon.png"), 710, 20, 35, 35);
		this.game.ctx.fillText(this.game.Hero.coins, 760, 50);
		
		// item one - grenade
		this.item1.draw();
		this.item2.draw();
		this.item3.draw();
		this.item4.draw();
	
		this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.pointerX, this.pointerY);
		
		// you can style here better
		if (this.purchaseFail) this.game.ctx.fillText("Not Enough Coins", 310, 450);
		else if (this.hasAttemptPurchase)this.game.ctx.fillText("Purchased", 350, 450);
		this.game.ctx.fillText("Press Enter to Select", 310, 650);
		
		//  continue button
		this.game.ctx.fillStyle = "#6AE1F5";
		roundRect(this.game.ctx, this.game.continueButton.x, this.game.continueButton.y, this.game.continueButton.width, 
									this.game.continueButton.height, 5, true, true);
		this.game.ctx.fillStyle = "#DAFEFF";
		this.game.ctx.font = "25px Verdana";
		this.game.ctx.fillText("CONTINUE", 342, 375);
		Entity.prototype.draw.call(this);
	}
}

/** Shop's Item.*/
function ShopItem(game, spritesheet, x, y, frameX, frameY, offset, price, type) {
	this.spritesheet = spritesheet;
	this.game = game;
	this.x = x;
	this.y = y + offset;
	this.offset = offset;
	this.frameX = frameX;
	this.frameY = frameY;
	this.price = price;
	this.type = type;
}

ShopItem.prototype.draw = function() {
	this.game.ctx.font = "20px Verdana";
	this.game.ctx.fillText(this.type, 300, 120 + this.offset);
	this.game.ctx.drawImage(this.spritesheet, this.x, this.y, this.frameX, this.frameY);
	// this.game.ctx.drawImage(AM.getAsset("./img/PowerUp/grenade.png"), 410, 95, 35, 35);
	this.game.ctx.drawImage(AM.getAsset("./img/PowerUp/coinIcon.png"), 490, 95 + this.offset, 35, 35);
	this.game.ctx.fillText(this.price, 550, 125 + this.offset);
	
}


/** Start Game Menu.*/
function GameMenu(game) {
	this.game = game;
	this.ctx = this.game.ctx;
}
GameMenu.prototype = new Entity();
GameMenu.prototype.constructor = GameMenu;

GameMenu.prototype.draw = function() {
	if (!this.game.startGame & !this.game.showSetting && !this.game.showCredit) {
		// start button
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, this.game.playButton.x, this.game.playButton.y, this.game.playButton.width, 
									this.game.playButton.height, 5, true, true);
		this.ctx.fillStyle = "#DAFEFF";
		this.ctx.font = "25px Verdana";
		this.ctx.fillText("START", 355, 325);
		
		// setting button
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, this.game.settingButton.x, this.game.settingButton.y, this.game.settingButton.width, 
									this.game.settingButton.height, 5, true, true);
		this.ctx.fillStyle = "#DAFEFF";
		this.ctx.font = "25px Verdana";
		this.ctx.fillText("CONTROLS", 325, 365);
		
		// credits button
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, this.game.creditButton.x, this.game.creditButton.y, this.game.creditButton.width, 
									this.game.creditButton.height, 5, true, true);
		this.ctx.fillStyle = "#DAFEFF";
		this.ctx.font = "25px Verdana";
		this.ctx.fillText("CREDITS", 340, 405);
	} else if (this.game.showSetting) {
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, 220, 200, 350, 250, 5, true, true);
		this.ctx.fillStyle = "#0a0a0a";
		this.ctx.font = "15px Verdana";
		this.ctx.fillText("Left Arrow + Right Arrow: Move", 290, 230);
		this.ctx.fillText("Up Arrow: Aim Gun Upward", 290, 260);
		this.ctx.fillText("Down Arrow: Aim Gun Downward", 290, 290);
		this.ctx.fillText("X: Jump", 290, 320);
		this.ctx.fillText("C: Shoot", 290, 350);
		this.ctx.fillText("Z: Use Special", 290, 380);
		// S: swap weapon
		// D: swap special
		
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, this.game.gobackButton.x, this.game.gobackButton.y, this.game.gobackButton.width, 
									this.game.gobackButton.height, 5, true, true);
		this.ctx.font = "20px Verdana";
		this.ctx.fillStyle = "#DAFEFF";
		this.ctx.fillText("Go Back", 360, 422);
	} else if (this.game.showCredit) {
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, 220, 200, 350, 250, 5, true, true);
		this.ctx.fillStyle = "#0a0a0a";
		this.ctx.font = "15px Verdana";
		this.ctx.fillText("Tommy: Developer", 310, 230);
		this.ctx.fillText("Vecheka: Developer", 310, 280);
		this.ctx.fillText("Huy: Developer", 310, 330);
	
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, this.game.gobackButton.x, this.game.gobackButton.y, this.game.gobackButton.width, 
									this.game.gobackButton.height, 5, true, true);
		this.ctx.font = "20px Verdana";
		this.ctx.fillStyle = "#DAFEFF";
		this.ctx.fillText("Go Back", 360, 422);
	} else if (this.game.gameOver) {
		
		this.ctx.font = "30px Verdana";
		this.ctx.shadowColor = "black";
		this.ctx.shadowBlur = 7;
		this.ctx.lineWidth = 5;
		this.ctx.strokeText("Game Over", 340, 250);
		this.ctx.shadowBlur = 0;
		this.ctx.fillStyle = "white";
		this.ctx.fillText("Game Over", 340, 250);
		
		this.ctx.lineWidth = 1;
		this.ctx.fillStyle = "#6AE1F5";
		roundRect(this.ctx, this.game.playAgainButton.x, this.game.playAgainButton.y, this.game.playAgainButton.width, 
									this.game.playAgainButton.height, 5, true, true);
	
		this.ctx.fillStyle = "#DAFEFF";
		this.ctx.font = "25px Verdana";
		this.ctx.fillText("Play Again", 360, 325);	
	}
}



/** Play button class.*/
function PlayButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.boundingbox = new BoundingBox(x, y, width, height);
}

PlayButton.prototype.isClick = function(pos) {
    return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y;
}


/** Setting button class.*/
function SettingButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.boundingbox = new BoundingBox(x, y, width, height);
}

SettingButton.prototype.isClick = function(pos) {
    return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y;
}

/** Credit button class.*/
function CreditButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.boundingbox = new BoundingBox(x, y, width, height);
}

CreditButton.prototype.isClick = function(pos) {
    return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y;
}


/** Play Again button class.*/
function PlayAgainButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.boundingbox = new BoundingBox(x, y, width, height);
}

PlayAgainButton.prototype.isClick = function(pos) {
    return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y;
}

/** Go Back button class.*/
function GoBackButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.boundingbox = new BoundingBox(x, y, width, height);
}

GoBackButton.prototype.isClick = function(pos) {
    return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y;
}

/** Go Back button class.*/
function ContinueButton(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.boundingbox = new BoundingBox(x, y, width, height);
}

ContinueButton.prototype.isClick = function(pos) {
    
	return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y;
}

// draw rounding corner rectangle.. Source: https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
		  radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}

}