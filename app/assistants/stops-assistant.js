function StopsAssistant (db) {
	this.db = db;
	this.favoriteStops = [];
}

StopsAssistant.prototype.setup = function () {
	// Setup application menu
	this.controller.setupWidget(Mojo.Menu.appMenu, cumtdMenuAttr, cumtdMenuModel);
	
	// Setup widgets
	this.controller.setupWidget("stopList",
		{
			itemTemplate: "stops/stop-item",
			addItemLabel: "Add ...",
			reorderable: true,
			swipeToDelete: true,
			uniquenessProperty: "ident"
		},
		{
			items: []
		}
	);
	
	this.controller.listen("stopList", Mojo.Event.listTap,
		this.inspectStop.bindAsEventListener(this));
	this.controller.listen("stopList", Mojo.Event.listAdd,
		this.addToDB.bindAsEventListener(this));
	this.controller.listen("stopList", Mojo.Event.listDelete,
		this.removeFromDB.bindAsEventListener(this));
	this.controller.listen("stopList", Mojo.Event.listReorder,
		this.reorderInDB.bindAsEventListener(this));
}

StopsAssistant.prototype.activate = function () {
	this.db.get("favoriteStops",
		(function (value) {
			this.favoriteStops = value;
			$("stopList").mojo.noticeUpdatedItems(0, value);
		}).bindAsEventListener(this)
	);
}

StopsAssistant.prototype.inspectStop = function (event) {
	Mojo.Controller.stageController.pushScene("stop-detail",
		event.item);
}

// Modifying favorites
StopsAssistant.prototype.addToDB = function (event) {
	Mojo.Controller.stageController.pushScene("stop-add",
		this.db, this.allStops);
}

StopsAssistant.prototype.removeFromDB = function (event) {
	var xs = this.favoriteStops.without(event.item);
	this.favoriteStops = xs;
	this.db.add("favoriteStops", xs);
	$("stopList").mojo.noticeUpdatedItems(0, xs);
	// this.activate();
}

StopsAssistant.prototype.reorderInDB = function (event) {
	var xs;
	
	// What a mess. This is why we use real languages...
	if (event.toIndex < event.fromIndex) {
		xs = this.favoriteStops.slice(0, event.toIndex);
		xs.push(event.item);
		xs.push(this.favoriteStops.slice(event.toIndex, event.fromIndex));
		xs.push(this.favoriteStops.slice(event.fromIndex+1));
	} else if (event.toIndex > event.fromIndex){
		xs = this.favoriteStops.slice(0, event.fromIndex);
		xs.push(this.favoriteStops.slice(event.fromIndex+1, event.toIndex+1));
		xs.push(event.item);
		xs.push(this.favoriteStops.slice(event.toIndex+1));
	}
	
	this.db.add("favoriteStops", xs.flatten());
	this.favoriteStops = xs.flatten();
	Mojo.Log.error(xs.flatten().toJSON());
}
