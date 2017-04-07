var express = require('express');  	//variabeln express lagrar hela express-funktionen som importeras.
								//biblioteket express existerar i variabeln express som en funktion.
var app = express();				//app använder sig av express-funktionen.
var server = app.listen(3000);		//i server-variabeln lagras allting som skickas in och ut på port 3000
app.use(express.static('public'));  //public-mappen är det som ska synas för allmänheten och visas upp när servern anropas.

var socket = require('socket.io')	//variabeln socket lagrar hela socket-funktionen som importeras.
								//biblioteket socket existerar i variabeln socket som en funktion.
var io = socket(server);			//variabeln io lagrar det socket-funktionen returnerar när socket-funktionen får variabeln server:s innehåll som argument.
								//Detta resulterar i att io innehåller allting som går in och ut till "servern" på port 3000.
var connectionCounter = 0;

//testar lite eget: 
var prePaintArray = [];

//Javascript reagerar på events och exekverar kod baserat på vilka events som händer:
//Events: 	Connection 		("Hej! Nu startar jag en koppling till dig!")
//			Messages		("Här kommer ett meddelande!")
//			Disconnection	("Hejdå! Nu bryter jag kopplingen!")

//Nu tar vi hand om den första typen av event som måste hanteras(New connection):
io.sockets.on('connection', newConnection);



function newConnection(socket) {
	connectionCounter = connectionCounter + 1;
	var users = {
		x : connectionCounter
	}
	io.sockets.emit("users", users);
	console.log('NEW CONNECTION: ' + socket.id + " . Current number of users: " + connectionCounter);

	if(prePaintArray.length > 0) {
		for(var i = 0; i < prePaintArray.length; i++) {
			socket.emit('oldPaint', prePaintArray[i]);
		}	
	}

	//Vi behöver ta emot meddelanden från våra kopplingar:
	//Startar den angivna funktionen mouseMsg då ett "mouse"-meddelande tas emot:
	socket.on('mouse', mouseMsg);
	//mouseMsg-funktionen måste då ligga id enna funktion (newConnection) för att kunna skicka över data (tydligen):

//Då funktionen mouseMsg startar så har meddelandet innehållit (utöver namnet "mouse") information. Vi lagrar denna information i parametern data. 
	function mouseMsg(newPaint) {
		//allt i data skickas ut till clienterna (EJ den client datan kommer ifrån!) via broadCast.emit via socket-kopplingen:
		socket.broadcast.emit('mouse', newPaint);
		//Alternativt sätt att skriva ovanstående, men så att ALLA clients får datan tillbaka (alltså även den som ursprungligen skickade ut datan): 
		//io.sockets.emit("mouse", data);


		//Lägger till den nya färgen i arrayen för all gammal färg:
		prePaintArray.push(newPaint);
	}

//Egna testfunktioner här under: 
	socket.on("clear", clearDrawing);

	function clearDrawing() {
		prePaintArray = [];
		socket.broadcast.emit("clearYourScreens");
	}

	socket.on("disconnect", lostConnection);

	function lostConnection(socket) {
		connectionCounter = connectionCounter - 1;
		console.log("USER DISCONNECTED, current users: " + connectionCounter);
		var users = {
			x : connectionCounter
		}
		io.sockets.emit("users", users);
	}
}





console.log("Server running");