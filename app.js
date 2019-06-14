var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


const Raspi = require('raspi-io').RaspiIO;
const five = require('johnny-five');



const board = new five.Board({
  io: new Raspi()
});

const EVENTS = {
   PRESS_DETECTED: 'press detected'
};


board.on('ready', () => {

  let button = new five.Button('P1-11');
  
  io.on('connection', (socket) => {
	  console.log("Socket Connected");
	  button.on("press", function(){
			console.log("Press");
			socket.emit(EVENTS.PRESS_DETECTED);
	  });
  });
  
  board.on("exit", function(){
         console.log("Exit");
  });
});

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000);

