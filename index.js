var five = require('johnny-five'),
	Edison = require('edison-io'),
	scroll = require('lcd-scrolling')
	;

var io = require('socket.io-client');

var board = new five.Board({
	io: new Edison(),
	repl: false,
});

var messages = [];

board.on('ready', function() {
	var messageLed = new five.Led(4);
	var button = new five.Button(3);
	var touch = new five.Button(2);
  var lcd = new five.LCD({
    controller: 'JHD1313M1'
  });
	
	scroll.setup({
		lcd: lcd,
		firstCharPauseDuration: 2000,
		lastCharPauseDuration: 750,
		scrollingDuration: 150
	});
	
	lcd.on().bgColor('#cccccc').print('Starting...');
	
	var displayMessage = function() {
		var message = messages[0];

		lcd.clear();
		scroll.clear();
		if (message.length > 16) scroll.line(0, message);
		else lcd.print(message);
	}
	var nextMessage = function() {
		if (messages.length === 0) return;
		
		messages.pop();
		if (messages.length > 0) displayMessage();
		else {
			lcd.clear();
			scroll.clear();
			messageLed.off();
		}
	}
	var respond = function(response) {	
		socket.emit('message', { message: response });
		
		nextMessage();
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
		messages.push(message);
		messageLed.on();

		if (messages.length === 1) displayMessage();
	});
	
	button.on('release', function() {
		nextMessage();
	});
	
	var touched;
	touch.on('release', function() {
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
