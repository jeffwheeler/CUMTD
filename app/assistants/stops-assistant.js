function StopsAssistant (stops) {
    this.stops = stops;
}

StopsAssistant.prototype = {
    setup: function() {
        // Setup application menu
        this.controller.setupWidget(Mojo.Menu.appMenu, cumtdMenuAttr, cumtdMenuModel);

        // Setup widgets
        this.controller.setupWidget("stopList",
            {
                listTemplate: "lists/list",
                itemTemplate: "lists/item",
                addItemLabel: "Add ...",
                reorderable: true,
                swipeToDelete: true,
                uniquenessProperty: "ident"
            },
            this.favoritesModel = {
                items: []
            }
        );

        this.controller.listen("stopList", Mojo.Event.listTap,
            this.inspectStop.bindAsEventListener(this));

        this.controller.listen("stopList", Mojo.Event.listAdd,
            this.addStop.bindAsEventListener(this));

        this.controller.listen("stopList", Mojo.Event.listDelete,
            this.removeStop.bindAsEventListener(this));

        this.controller.listen("stopList", Mojo.Event.listReorder,
            this.reorderStops.bindAsEventListener(this));
    },

    activate: function() {
        this.stops.loadFavoriteStops(
            (function (stops) {
                this.favoritesModel.items = stops;
                this.controller.modelChanged(this.favoritesModel);
            }).bindAsEventListener(this)
        );
    },

    inspectStop: function() {
        Mojo.Controller.stageController.pushScene("stop-detail",
            event.item);
    },

    addStop: function() {
        Mojo.Controller.stageController.pushScene("stop-add",
            this.stops);
    },

    removeStop: function(event) {
        this.stops.favoriteStops = this.stops.favoriteStops.without(event.item);

        Mojo.Log.info("Removing stop", Object.toJSON(this.stops.favoriteStops));
        this.stops.save();
    },

    reorderStops: function(event) {
        this.stops.favoriteStops.splice(event.fromIndex, 1);
        this.stops.favoriteStops.splice(event.toIndex, 0, event.item);

        Mojo.Log.info("Reorder", Object.toJSON(this.stops.favoriteStops));
        this.stops.save();
    }
}

