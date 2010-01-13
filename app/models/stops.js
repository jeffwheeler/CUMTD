var Stops = Class.create({
   allStops: allStopsBig,

    initialize: function() {
        this.db = new Mojo.Depot(
            {
                name: "CUMTD",
                version: 1,
                replace: false
            }
        );
    },

    loadFavoriteStops: function(onLoad) {
        this.db.get("favoriteStops",
            (function(stops) {
                if (stops == null) {
                    stops = [];

                    var allStopsLength = this.allStops.length;
                    for (var i=0; i<allStopsLength; i++) {
                        if (this.allStops[i].defaultStop) {
                            stops.push(this.allStops[i]);
                        }
                    }

                    this.db.add("favoriteStops", stops);
                }

                this.favoriteStops = stops;
                onLoad(stops);
            }).bindAsEventListener(this)
        );
    },

    loadNonFavoritedStops: function(onLoad) {
        Mojo.Log.info("Loading non-favorited apps");

        this.loadFavoriteStops(
            (function(favorites) {
                var nonFavs = [];

                var allStopsLength = this.allStops.length;
                for (var i=0; i<allStopsLength; i++) {
                    var inFavs = false;

                    var favoritesLength = favorites.length;
                    for (var j=0; j<favoritesLength; j++) {
                        inFavs |= (favorites[j].ident == this.allStops[i].ident);
                    }

                    if (!inFavs) {
                        nonFavs.push(this.allStops[i]);
                    }
                }

                onLoad(nonFavs);
            }).bindAsEventListener(this)
        );
    },

    appendFavoriteStop: function(stop, onSuccess) {
        this.loadFavoriteStops(
            (function(stops) {
                stops.push(stop);
                this.db.add("favoriteStops", stops);
                onSuccess();
            }).bindAsEventListener(this)
        );
    },

    save: function() {
        this.db.add("favoriteStops", this.favoriteStops);
    }
});

