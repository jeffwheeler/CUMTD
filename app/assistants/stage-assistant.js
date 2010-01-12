function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    this.stops = new Stops();

    cumtdMenuAttr = { omitDefaultItems: true };
    cumtdMenuModel =
        {
            visible: true,
            items: [
                {label:"About CUMTD", command:"do-about"},
                {label:"Preferences", command:"do-prefs"}
            ]
        };

    this.controller.pushScene("stops", this.stops);
}

StageAssistant.prototype.handleCommand = function (event) {
    if (event.type === Mojo.Event.command) {
        if (event.command == "do-about") {
            this.controller.pushScene("about");
        } else if (event.command == "do-prefs") {
            this.controller.pushScene("preferences", this.db);
        }
    }
}

