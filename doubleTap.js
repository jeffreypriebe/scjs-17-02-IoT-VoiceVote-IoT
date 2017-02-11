module.exports = function(singleTap, doubleTap) {
	var touched;
	
	return function() {
		console.log(touched);
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
