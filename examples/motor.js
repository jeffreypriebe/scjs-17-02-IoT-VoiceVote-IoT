var five = require('johnny-five'),
	Edison = require('edison-io')
	;

var Uln200xa_lib = require('jsupm_uln200xa');

var myUln200xa_obj = new Uln200xa_lib.ULN200XA(4096, 8, 9, 10, 11);

myUln200xa_obj.goForward = function()
{
    myUln200xa_obj.setSpeed(10); // 5 RPMs
    myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA_DIR_CW);
    console.log("Rotating 1/4 revolution clockwise.");
    myUln200xa_obj.stepperSteps(4096 / 4);
		console.log("done");
};

myUln200xa_obj.stop = function()
{
	myUln200xa_obj.release();
};

myUln200xa_obj.quit = function()
{
	myUln200xa_obj = null;
	Uln200xa_lib.cleanUp();
	Uln200xa_lib = null;
	console.log("Exiting");
	process.exit(0);
};

var board = new five.Board({
	io: new Edison()
});

board.on('ready', function() {
	board.on('exit', function() {
		myUln200xa_obj.quit();
	});

	var button = new five.Button(4);
	var touch = new five.Button(3);
	
	button.on('release', function() {
		myUln200xa_obj.goForward();
	});
	
	touch.on('release', function() {
		myUln200xa_obj.quit();
	});

});
