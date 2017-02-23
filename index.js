var five = require('johnny-five'),
	Edison = require('edison-io'),
	scroll = require('lcd-scrolling')
	io = require('socket.io-client'),
	dw = require('diceware'),
	Messages = require('./messages'),
	doubleTap = require('./doubleTap')
	;

var ENABLE_MOTOR = false;													// Enables the stepper motor
var SERVER = 'https://voicevote.jeffreypriebe.com';	// Socket server to recieve messages

var board = new five.Board({
	io: new Edison(),
	repl: false,
});

board.on('ready', function() {
	var messageLed = new five.Led(4);
	var button = new five.Button(3);
	var touch = new five.Button(2);
  var lcd = new five.LCD({
    controller: 'JHD1313M1'
  });
	var motor = ENABLE_MOTOR ? require('./motor')() : { forward: function(){}, backward: function() {}, quit: function(){} };
	
	scroll.setup({
		lcd: lcd,
		firstCharPauseDuration: 2000,
		lastCharPauseDuration: 750,
		scrollingDuration: 150
	});
	
	lcd.on().bgColor('#cccccc').print('Starting...');
	
	var messages = new Messages(
		function() { lcd.clear(); scroll.clear(); }, 				// Clear
		function() { messageLed.off(); motor.backward(); }, // Empty
		function() { motor.forward(); messageLed.on(); },		// Fist Message
		function(message) { lcd.print(message); },					// Display
		function(message) { scroll.line(0, message); }			// Display Long
	);
	
	const socket = io(SERVER, {
		secure: true,
		// transports: ['websocket'],
		jsonp: false
	});

	var roomName = dw(1);	// Select a random name for the socket "room"
	socket.on('connect', function () {
		socket.emit('join', { name: roomName });
		lcd.clear().print('> ' + roomName);
	});
	socket.on('message', function(data) {
		messages.receive(data.message);
	});
	
	// On button release, clear the current message, display next message (if any)
	button.on('release', function() {
		messages.nextMessage();
	});
	
	var respond = function(response) {	
		socket.emit('message', { message: response });
		messages.nextMessage();
	}
	var double = doubleTap(
		function() { respond('👍'); },
		function() { respond('👎'); }
	);
	// On touch button, respond
	touch.on('release', function() {
		if (!messages.hasMessages()) return;	// Can only respond to a displayed message
		double();
	});
	
	socket.connect();
	
	board.on('warn', function(event) {
		if (event.class === 'Board' && event.message === 'Closing.') {	// This is the shutdown of the edison. 
			motor.quit();
			lcd.bgColor('#000000').off();
			messageLed.off();
		}
	});
});
