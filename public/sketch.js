//variabeln som vi lagrar kopplingen till servern i:
var socket;
var myColor;
var resetButton;
var changeColorButton;
var numberOfUsersText;
var currentNumberOfUsers;
var myText;

function setup() {
	createCanvas(1000, 500);
	background(51);
	frameRate(30);
	currentNumberOfUsers = 0;

	myText = createP("Number of users: ");
	myText.id("numberOfUsersText");
	myText.position(50, 520);
	resetButton = createButton("Clear");
	resetButton.position(150, 520);
	resetButton.mousePressed(sendClearMessage);
	resetButton.size(100, 60);

	changeColorButton = createButton("Change Color");
	changeColorButton.position(300, 520);
	changeColorButton.mousePressed(changeMyColor);
	changeColorButton.size(100, 60);
	textSize(32);
	myColor = [random(0,256), random(0,256), random(0,256)];
//öppnar och lagrar en koppling till servern i variabeln socket: 
	socket = io.connect('http://10.1.17.108:3000');
//Om just denna socket (io) tar emot ett meddelande vid namn "mouse", så startas funktionen newDrawing:
	socket.on('mouse', newDrawing);

//Testar lite: 
	socket.on('oldPaint', startPaint);
	socket.on("clearYourScreens", receivedClearMessage);
	socket.on("users", setCurrentNumberOfUsers);
}	

function startPaint(oldPaint) {
	noStroke();
	fill(oldPaint.color);
	ellipse(oldPaint.x, oldPaint.y, 30, 30);
}
//Följande händer då "mouse"-meddelanden tas emot via socket:en io (dvs då andra clienter har ritat något och detta även behöver ritas ut på andra clienters skärmar):
function newDrawing(data) {
	noStroke();
	fill(data.color);
	ellipse(data.x, data.y, 30, 30);
}


function mouseDragged() {
//När vi ska skicka ett meddelande (information) så behöver innehållandes informationen som ska skickas: i ett javascript-object innehållandes informationen som ska skickas: 
	var data = {
		x: mouseX, 
		y: mouseY,
		color: myColor
	}
	
//Sedan skickar vi meddelandet till servern via socket-kopplingen genom att namnge meddelandet och bifoga informationen som meddelandet ska innehålla: 
	socket.emit('mouse', data);

	noStroke();
	fill(myColor);
	ellipse(mouseX, mouseY, 30, 30);
}

function sendClearMessage() {
	socket.emit("clear");
	clear();
	background(51);
}

function receivedClearMessage() {
	clear();
	background(51);
}
 
function changeMyColor() {
	myColor = [random(0,256), random(0,256), random(0,256)];
}

function setCurrentNumberOfUsers (users) {
	currentNumberOfUsers = users.x;
	document.getElementById("numberOfUsersText").textContent = ("Users: " + currentNumberOfUsers);
}

function draw() {

}
