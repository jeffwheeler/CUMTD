function PreferencesAssistant(db) {
	this.db = db;
}

PreferencesAssistant.prototype.setup = function() {
	this.controller.setupWidget("resetButton",
		{},
		{ label: "Reset Database" }
	);
	
	this.controller.listen("resetButton", Mojo.Event.tap,
		this.resetDB.bindAsEventListener(this));
}

//Database management
PreferencesAssistant.prototype.resetDB = function () {
	this.db.removeAll();
}
