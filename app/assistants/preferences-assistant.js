function PreferencesAssistant(stops) {
    this.stops = stops;
}

PreferencesAssistant.prototype.setup = function() {
    // Setup reset button
    this.controller.setupWidget("resetButton",
        {},
        { label: "Reset Database" }
    );

    this.controller.listen("resetButton", Mojo.Event.tap,
        this.resetDB.bindAsEventListener(this));
}

//Database management
PreferencesAssistant.prototype.resetDB = function () {
    this.stops.reset();
}

