var five = require('johnny-five'),
	Edison = require('edison-io'),
	scroll = require('lcd-scrolling')
	io = require('socket.io-client'),
	Messages = require('./messages')
	;

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
	var motor = require('./motor.js')();
	
	scroll.setup({
		lcd: lcd,
		firstCharPauseDuration: 2000,
		lastCharPauseDuration: 750,
		scrollingDuration: 150
	});
	
	lcd.on().bgColor('#cccccc').print('Starting...');
	
	var messages = new Messages(
		function() { lcd.clear(); scroll.clear(); }, 					// Clear
		// function() { messageLed.off(); motor.backward(); }, 	// Empty
		// function() { motor.forward(); messageLed.on(); },	// Fist Message
		function() { messageLed.on(); },	// Fist Message
		function(message) { lcd.print(message); },				// Display
		function(message) { scroll.line(0, message); }		// Display Long
	);
	
	var respond = function(response) {	
		socket.emit('message', { message: response });
		
		messages.nextMessage();
	}
	
	const socket = io('ws://192.168.1.45:30809', {
		transports: ['websocket'],
		jsonp: false
	});
	socket.on('connect', function () {
		socket.emit('join', { name: 'test' });
		lcd.clear();
	});
	socket.on('message', function(data) {
		var message = data.message;
		messages.receive(message);
	});
	
	button.on('release', function() {
		messages.nextMessage();
	});
	
	var touched;
	touch.on('release', function() {
		if (messages.length === 0) return;
		if (touched) {
			clearTimeout(touched);
			touched = undefined;
			respond('👎');
		} else {
			touched = setTimeout(function() {
				touched = undefined;
				respond('👍');
			}, 250);
		}
	});
	
	socket.connect();
	
	board.on('warn', function(event) {
		if (event.class === 'Board' && event.message === 'Closing.') {
			lcd.bgColor('#000000').off();
			messageLed.off();
		}
	});
});
