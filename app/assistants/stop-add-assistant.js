function StopAddAssistant (db) {
    this.db = db;
    this.availableStops = [];
}

StopAddAssistant.prototype.setup = function () {
    // Setup application menu
    this.controller.setupWidget(Mojo.Menu.appMenu, cumtdMenuAttr, cumtdMenuModel);
    this.controller.setupWidget("filteredStopsList",
        {
            listTemplate: "lists/list",
            itemTemplate: "lists/item",
            filterFunction: this.filterFunction.bind(this)
        },
        { disabled: false }
    );

    // Add all stops to the model that aren't already favorited
    this.db.get("allStops",
        (function (allStops) {
            this.db.get("favoriteStops",
                (function (value) {
                    var xs = allStops.filter(function (stop) {
                        return (value.filter(function (favorite) {
                            return favorite.ident == stop.ident; 
                        }).length==0);
                    });

                    this.availableStops = xs;
                    $("filteredStopsList").mojo.noticeUpdatedItems(0, xs);
                    $("filteredStopsList").mojo.setLength(xs.length);
                    $("filteredStopsList").mojo.setCount(xs.length);
                }).bindAsEventListener(this)
            );
        }).bindAsEventListener(this)
    );

    this.controller.listen("filteredStopsList", Mojo.Event.listTap,
    this.favoriteStop.bindAsEventListener(this));
}

StopAddAssistant.prototype.favoriteStop = function (event) {
    this.db.get("favoriteStops",
        (function (value) {
            value.push(event.item);
            this.db.add("favoriteStops", value);
            Mojo.Controller.stageController.popScene();
        }).bindAsEventListener(this)
    );
}

StopAddAssistant.prototype.filterFunction = function (filterString, listWidget, offset, count) {
    var stops = [];
    if (filterString == "") {
        stops = this.availableStops;
    } else {
        stops = this.availableStops.filter(function (stop) {
            return stop.name.toLowerCase().include(filterString.toLowerCase());
        });
    }

    listWidget.mojo.noticeUpdatedItems(offset, stops);
    listWidget.mojo.setLength(stops.length);
    listWidget.mojo.setCount(stops.length);
}

