function StopAddAssistant (stops) {
    this.stops = stops;
    this.availableStops = [];
}

StopAddAssistant.prototype = {
    setup: function () {
        // Setup application menu
        this.controller.setupWidget(Mojo.Menu.appMenu, cumtdMenuAttr, cumtdMenuModel);
        this.controller.setupWidget("filteredStopsList",
            {
                listTemplate: "lists/list",
                itemTemplate: "lists/item",
                filterFunction: this.filterFunction.bind(this),
                lookahead: 1000
            },
            { disabled: false }
        );

        // Add all stops to the model that aren't already favorited
        this.stops.loadNonFavoritedStops(
            (function(stops) {
                this.availableStops = stops;

                $("filteredStopsList").mojo.noticeUpdatedItems(0, stops);
                $("filteredStopsList").mojo.setLength(stops.length);
                $("filteredStopsList").mojo.setCount(stops.length);
            }).bindAsEventListener(this)
        );

        this.controller.listen("filteredStopsList", Mojo.Event.listTap,
            this.favoriteStop.bindAsEventListener(this));
    },

    favoriteStop: function (event) {
        this.stops.appendFavoriteStop(event.item,
            (function() {
                Mojo.Controller.stageController.popScene();
            })
        );
    },

    filterFunction: function (filterString, listWidget, offset, count) {
        var lowerFilter = filterString.toLowerCase();
        var stops = [];

        if (lowerFilter == "") {
            stops = this.availableStops;
        } else {
            var availableStopsLength = this.availableStops.length;
            for (var i=0; i<availableStopsLength; i++) {
                var stop = this.availableStops[i];

                if (stop.name.toLowerCase() == lowerFilter) {
                    stops.splice(0, 1, stop);
                } else {
                    var words = lowerFilter.split(" ");

                    var matches = true;
                    for (var j=0; j<words.length; j++) {
                        var word = words[j];
                        matches &= (stop.name.toLowerCase().include(word)
                                 || stop.numeric.toLowerCase().include(word))
                    }

                    if (matches) {
                        stops.push(stop);
                    }
                }
            }
        }

        listWidget.mojo.noticeUpdatedItems(offset, stops);
        listWidget.mojo.setLength(stops.length);
        listWidget.mojo.setCount(stops.length);
    }
}

