/**
 * Initialize the Fw7 app and add views
 */
var pvKweekApp = new Framework7();
pvKweekApp.addView('#eggcalendar-view');
pvKweekApp.addView('#birdies-age-view', { dynamicNavbar: true }); // Because we use fixed-through navbar we can enable dynamic navbar
pvKweekApp.addView('#settings-about');

/* Setup Alternate Android Styling */
(function () {
    if (Framework7.prototype.device.android) {
       Dom7('head').append('<link rel="stylesheet" href="css/framework7.material.min.css">');
    }
})();

var $$ = Dom7;

/**
 * The real KweekHulp app
 */
var pvKweekHulp = {

    // Defaults
    default_hatch_days: 18,
    default_age_list_days: 71,

    // Application Constructor
    initialize: function()
    {
        var hatch_days = this.default_hatch_days;
        var age_list_days = this.default_age_list_days;

        if(this.isLocalStorageAvailable())
        {
            if(ls_hatch_days = localStorage.getItem("pv-kh-hatch_days"))
            {
                hatch_days = parseInt(ls_hatch_days);
            }

            if(ls_age_list_days = localStorage.getItem("pv-kh-age_list_days"))
            {
                age_list_days = parseInt(ls_age_list_days);
            }
        }

        this.setupSettings(hatch_days, age_list_days);

        this.populateEggHatchList(hatch_days);
        this.populateBirdieAgeList(age_list_days);
    },

    isLocalStorageAvailable: function()
    {
        // this code is borrowed from modernizer
        var mod = 'pv-kh';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    },

    setupSettings: function(hatch_days, age_list_days)
    {
        $$('#slider_days_age').val(age_list_days);
        $$('#slider_days_hatch').val(hatch_days);
        $$('#slider_value_days_age').html(age_list_days);
        $$('#slider_value_days_hatch').html(hatch_days);
    },

    populateEggHatchList: function(hatch_days)
    {
        var dateArray = getDates((new Date()).subtractDays(1), (new Date()).addDays(hatch_days));
        var hatchdates = [];
        for (i = 0; i < dateArray.length; i ++ )
        {
            hatchdates.push({
                'hatch_date': dateArray[i].toNLString(true),
                'lay_date': dateArray[i].subtractDays(hatch_days).toNLString(true),
                'selected': dateArray[i].toNLString(true) == (new Date).toNLString(true)
            });
        }

        var compiledEggCalendarTemplate = Template7.compile($$('script#eggcalendar_template').html());
        var egg_list = compiledEggCalendarTemplate({days: hatchdates, today: (new Date()).toNLString});
        $$('#eggcalendar-list').html(egg_list);
    },


    populateBirdieAgeList: function(days)
    {
        var birdieAgeArray = getDates((new Date()).subtractDays(days), new Date());
        var ageDates = [];
        for (i = 0; i < birdieAgeArray.length; i++ )
        {
            if(i % 2 != 0)
            {
                ageDates.unshift({
                    'hatch_date': birdieAgeArray[i].toNLString(),
                    'age_in_days': getDifferenceInDays((new Date()), birdieAgeArray[i]),
                    'selected': birdieAgeArray[i].toNLString(true) == (new Date).toNLString(true)
                });
            }
        }

        var compiledBirdieAgeTemplate = Template7.compile($$('script#birdie_age_template').html());
        var age_list = compiledBirdieAgeTemplate({ages: ageDates});
        $$('#birdie-age-list').html(age_list);
    }
};

pvKweekHulp.initialize();

$$('input[type="range"]').on('input', function (e) {

    var new_age_value = parseInt($$('#slider_days_age').val());
    var new_hatch_value = parseInt($$('#slider_days_hatch').val());

    if(pvKweekHulp.isLocalStorageAvailable())
    {
        localStorage.setItem("pv-kh-hatch_days", new_hatch_value);
        localStorage.setItem("pv-kh-age_list_days", new_age_value);
    }

    pvKweekHulp.populateEggHatchList(new_hatch_value);
    pvKweekHulp.populateBirdieAgeList(new_age_value);
    pvKweekHulp.setupSettings(new_hatch_value, new_age_value);
});