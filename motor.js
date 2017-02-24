var Uln200xa_lib = require('jsupm_uln200xa');

module.exports = function () {
	var motor = new Uln200xa_lib.ULN200XA(4096, 8, 9, 10, 11);

	var move = function(direction, steps) {
		if (steps < 1 || !steps) steps = 2;
		motor.setSpeed(10); // RPMs
		motor.setDirection(direction);
		motor.stepperSteps(4096 / 4 * steps);
	}

	motor.forward = function (quarterSteps) {
		move(Uln200xa_lib.ULN200XA_DIR_CCW, quarterSteps);
	};
	
	motor.backward = function(quarterSteps) {
		move(Uln200xa_lib.ULN200XA_DIR_CW, quarterSteps);
	}

	motor.stop = function () {
		motor.release();
	};

	motor.quit = function () {
		motor = null;
		Uln200xa_lib.cleanUp();
		Uln200xa_lib = null;
	};
	
	return motor;
}