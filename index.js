var five = require('johnny-five'),
	Edison = require('edison-io')
	;

// window.navigator.userAgent = 'react-native';
var io = require('socket.io-client');

var board = new five.Board({
	io: new Edison(),
	repl: false,
});

var messages = [];

board.on('ready', function() {
	var messageLed = new five.Led(4);
	
  var lcd = new five.LCD({
    controller: "JHD1313M1"
  });
	
	lcd.on().bgColor('#cccccc').print('Starting...');
	
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
		lcd.clear().print(message);
	});
	socket.connect();
	
	setTimeout(function() {
		messageLed.off();
	}, 500);
	
	board.on('warn', function(event) {
		if (event.class === 'Board' && event.message === 'Closing.') {
			lcd.bgColor('#000000').off();
			messageLed.off();
		}
	});
});
