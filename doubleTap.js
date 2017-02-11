module.exports = function(singleTap, doubleTap) {
	var touched;
	
	return function() {
		if(touched) {
			clearTimeout(touched);
			touched = undefined;
			doubleTap();
		} else {
			touched = setTimeout(function() {
				touched = undefined;
				singleTap();
			}, 350);
		}
	};
}
