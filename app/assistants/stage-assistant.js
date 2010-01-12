function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    cumtdMenuAttr = { omitDefaultItems: true };
    cumtdMenuModel =
        {
            visible: true,
            items: [
                {label:"About CUMTD", command:"do-about"},
                Mojo.Menu.editItem,
                {label:"Preferences", command:"do-prefs"}
            ]
        };

    this.allStops =[{name:"ARC", ident:"ARC"},
                    {name:"Champaign Walmart", ident:"WALMART"},
                    {name:"FAR", ident:"FAR"},
                    {name:"Grainger Library", ident:"GEL"},
                    {name:"Green & Mathews", ident:"GRNMAT"},
                    {name:"Green & Wright", ident:"GRNWRT"},
                    {name:"Gregory at Library", ident:"GRGLIB"},
                    {name:"Gregory at Mumford Hall", ident:"GRGMUM"},
                    {name:"Illini Union", ident:"IU"},
                    {name:"Illini Union Engineering Side", ident:"IUE"},
                    {name:"Illinois Terminal at Market St.", ident:"ITMKT"},
                    {name:"ISR", ident:"ISR"},
                    {name:"Kirby and Valley Rd.", ident:"KBYVYRD"},
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
                    {name:"Wright & Springfield", ident:"WRTSPFLD"}]

    this.defaultFavoriteStops =
        [{name:"Illini Union", ident:"IU"},
         {name:"Illini Union Engineering Side", ident:"IUE"}];

    this.db = new Mojo.Depot(
        {
            name: "CUMTD",
            version: 1,
            replace: false
        },
        this.dbConnectSuccess.bind(this)
    );

    this.controller.pushScene("stops", this.db);
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

StageAssistant.prototype.dbConnectSuccess = function () {
    Mojo.Log.error("connected successfully");
    this.db.get("allStops",
        (function (value) {
            if (value == null) {
                value = this.allStops;
                this.db.add("allStops", value);
            }
        }).bindAsEventListener(this)
    );

    this.db.get("favoriteStops",
        (function (value) {
            if (value == null) {
                value = this.defaultFavoriteStops;
                this.db.add("favoriteStops", value);
            }
            $("stopList").mojo.noticeUpdatedItems(0, value);
            // this.favoriteStops = value;
        }).bindAsEventListener(this)
    );
}

