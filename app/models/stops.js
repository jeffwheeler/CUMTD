var Stops = Class.create({
    allStops: [
        {name:"ARC", ident:"ARC"},
        {name:"Champaign Walmart", ident:"WALMART"},
        {name:"FAR", ident:"FAR"},
        {name:"Grainger Library", ident:"GEL"},
        {name:"Green & Mathews", ident:"GRNMAT"},
        {name:"Green & Wright", ident:"GRNWRT"},
        {name:"Gregory at Library", ident:"GRGLIB"},
        {name:"Gregory at Mumford Hall", ident:"GRGMUM"},
        {name:"Illini Union", ident:"IU", defaultStop:true},
        {name:"Illini Union Engineering Side", ident:"IUE", defaultStop:true},
        {name:"Illinois Terminal at Market St.", ident:"ITMKT"},
        {name:"ISR", ident:"ISR"},
        {name:"Kirby & Valley Rd.", ident:"KBYVYRD"},
        {name:"Krannert Center", ident:"KRANNERT"},
        {name:"Lincoln Square (Courthouse)", ident:"LSE"},
        {name:"Lincoln Square (Parking Garage)", ident:"LSG"},
        {name:"Lot E-14", ident:"E14"},
        {name:"Meijer Drive at Meijer", ident: "MEIJER"},
        {name:"Neil & Stadium", ident:"NEILSTDM"},
        {name:"PAR", ident:"PAR"},
        {name:"Parkland College", ident:"PKLN"},
        {name:"Savoy Walmart", ident:"SWALMART"},
        {name:"Sunnycrest Mall", ident:"FLSUN"},
        {name:"Transit Plaza", ident:"PLAZA"},
        {name:"Urbana Meijer", ident:"URBMEIJ"},
        {name:"Urbana Walmart", ident:"UWALMART"},
        {name:"Willard Airport", ident:"WILLARD"},
        {name:"Wright & Springfield", ident:"WRTSPFLD"},
    ],

    initialize: function() {
        // Wrap ampersands and fill default favorite stops
        this.favoriteStops = [];
        for (var i=0; i<this.allStops.length; i++) {
            this.allStops[i].name = this.allStops[i].name.gsub("&",
                "<span class=\"amp\">&amp;</span>");
            if (this.allStops[i].defaultStop) {
                this.favoriteStops.push(this.allStops[i]);
            }
        }

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
                    stops = this.favoriteStops;
                    this.db.add("favoriteStops", stops);
                }
                onLoad(stops);
            }).bindAsEventListener(this)
        );
    },

    loadNonFavoritedStops: function(onLoad) {
        Mojo.Log.info("Loading non-favorited apps");

        this.loadFavoriteStops(
            (function(favorites) {
                var nonFavs = [];
                for (var i=0; i<this.allStops.length; i++) {
                    if (favorites.indexOf(this.allStops[i]) < 0) {
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

