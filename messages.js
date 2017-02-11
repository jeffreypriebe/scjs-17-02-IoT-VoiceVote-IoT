function Messages(clear, empty, firstMessage, displayMessage, displayMessageLong) {
	this.messages = [];
	this.clear = clear;
	this.empty = empty;
	this.firstMessage = firstMessage;
	this.displayMessage = displayMessage;
	this.displayMessageLong = displayMessageLong;
}

Messages.prototype.hasMessages = function () {
	return this.messages.length > 0;
}

Messages.prototype.showMessage = function () {
	var message = this.messages[0];
	var display = message.length > 16 ? this.displayMessageLong : this.displayMessage;

	this.clear();
	display(message);
}

Messages.prototype.nextMessage = function () {
	if (this.messages.length < 1) return;

	this.messages.splice(0, 1);
	if (this.messages.length > 0) this.showMessage();
	else { this.clear(); this.empty(); }
}

Messages.prototype.receive = function (message) {
	var firstMessage = this.messages.length === 0;

	this.messages.push(message);
	
	if (firstMessage) {
		this.firstMessage();
		this.showMessage();
	}
}
module.exports = Messages;