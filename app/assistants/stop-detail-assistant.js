function StopDetailAssistant (stop) {
	this.stop = stop;
}

StopDetailAssistant.prototype.setup = function () {
	// Setup application menu
	this.controller.setupWidget(Mojo.Menu.appMenu, cumtdMenuAttr, cumtdMenuModel);
	
	// Setup widgets
	this.controller.setupWidget("loading-spinner",
		{ spinnerSize: "large" },
		{ spinning: true }
	);

	this.controller.setupWidget("busesList",
		this.attributes = {
			itemTemplate: "stop-detail/bus-item",
			reorderable: false,
			swipeToDelete: false,
		},
		{items: []}
	);
	
	// Start ajax request
	this.loadData();
}

StopDetailAssistant.prototype.loadData = function () {
	var self = this;
	new Ajax.Request("http://cumtd-proxy.appspot.com/",
		{
			method: "get",
			parameters: {ident: self.stop.ident},
			onSuccess: function (response) {
				// Load header
				$("stopTitle").insert(self.stop.name);

				// Add items to list
				var content = eval(response.responseText);
				if (content != null) {
					self.controller.setWidgetModel("busesList",
						{items: content});
					$("body").hide();
				} else {
					$("bodyText").insert("No routes are currently scheduled for this stop.");
					$("list").hide();
				}
				
				// Stop spinning and hide scrim
				self.controller.setWidgetModel("loading-spinner", {spinning: false});
				$("loading-scrim").hide();
			}
		}
	);
}
