// const CHECK_POINT_ONE = "check_point_one";

function Database() {
	// this.socket;
	this.gameData;
	this.init();
}

Database.prototype.init = function() {
	this.socket = io.connect("http://24.16.255.56:8888"); 
	
}

Database.prototype.load = function() {
	this.socket.emit("load", { studentname: "Vecheka Chhourn", statename: STATE_NAME});
	this.socket.on("load", function (data) {
		if (gameEngine.startGame) {
			
		} else {
			
		}
		
	});
}

Database.prototype.save = function(stateName, data) {
	this.socket.emit("save", {studentname: "Vecheka Chhourn", statename: stateName, data: data});
	console.log("Saved");
}



Database.prototype.connect = function() {
	this.socket.on("connect", function () {
        console.log("Socket connected.")
    });
    
}

Database.prototype.disconnect = function() {
	this.socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    
}