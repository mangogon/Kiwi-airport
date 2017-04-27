$(function(){

    /*
     * Country and city data
     * They are defined as lists of JS objects
     */

    // A country has a code and a name
    var countries=[
        {code:'fr',
         name:'France'},
        {code:'ua',
         name:'Ukraine'},
        {code:'de',
         name:'Germany'},
        {code:'it',
         name:'Italy'}
    ];

    var countries2 = {
        fr: 'France',
        ua: 'Ukraine',
        de: 'Germany',
        it: 'Italy'
    };

    // A city has a name and a country (country code, actually)
    var cities=[
        {name:'Paris',
         country:'fr',
         destinations: [{name:'Kyiv', price:200},
                        {name:'Marseille', price:20}
                       ]
        },
        {name:'Marseille',
         country:'fr',
         destinations:[{name:'Paris', price:10},
                       {name:'Lviv', price:10}
                      ]
        },
        {name:'Lyon',
         country:'fr',
         destinations:[{name:'Berlin', price:10},
                       {name:'Dresden', price:10}, {name:'Florence', price:10}
                      ]
        },
        {name:'Lviv',
         country:'ua',
         destinations:[{name:'Verona', price:10},
                       {name:'Paris', price:10},
                       {name:'Berlin', price:10},
                       {name:'Kyiv', price:10}
                      ]
        },
        {name:'Kyiv',
         country:'ua',
         destinations:[{name:'Paris', price:10},
                       {name:'Marseille', price:10},
                       {name:'Lviv', price:10}
                      ]
        },
        {name:'Roma',
         country:'it',
         destinations:[{name:'Lyon', price:10},
                       {name:'Berlin', price:10},
                       {name:'Paris', price:10},
                       {name:'Lviv', price:10}
                      ]
        },
        {name:'Florence',
         country:'it',
         destinations:[{name:'Roma', price:10},
                       {name:'Berlin', price:10},
                       {name:'Paris', price:10}
                      ]
        },
        {name:'Verona',
         country:'it',
         destinations:[{name:'Dresden', price:10},
                       {name:'Kyiv', price:10},
                       {name:'Roma', price:10}
                      ]
        },
        {name:'Berlin',
         country:'de',
         destinations:[{name:'Paris', price:10},
                       {name:'Lviv', price:10},
                       {name:'Roma', price:10}
                      ]
        },
        {name:'Dresden',
         country:'de',
         destinations:[{name:'Berlin', price:10},
                       {name:'Verona', price:10}
                      ]
        }
    ];


    // The Handlebars template which is going to build the results table
    var go_source = $('#go-template').html();
    var go_template = Handlebars.compile(go_source);

    var from_source = $('#from-template').html();
    var from_template = Handlebars.compile(from_source);

    $("#choose").val("");

    // Click handler
    $("#country").click(function(){

        // First, we read the value of the <select> element -> country code
        var country_codes = $("#choose").val();

        // We calculate the list of all cities belonging to the country
        var result = searchCitiesByCountry(country_codes);

        // Now we are going to add the country names to the results
        var result2=[];
        for(var i=0; i<result.length;i++){
            var city=result[i];
            city.country_name = countries2[city.country];
            result2.push(city);
        }

        // We use Handlebars to calculate the results table

        // The context = the variables we send to Handlebars
        var context={country:country_codes, result:result2};
        // The calculated HTML code
        var rendered_template=go_template(context);
        // We inject this code into the "go" <div>
        $('#go').html(rendered_template);
        // Finally, we define the click handler on the 'class="from"' elements
        $(".from").click(handleClickOnFromELements);

    })

    /*
     * Click handlers
     */

    function handleClickOnFromELements() {
        $(".navbar").hide();
        $("#go").hide();

        var home = $(this).html();
        var cityFrom = searchCityByName(home);
        var destinations = cityFrom.destinations;
        var result = [];
        for(var i=0; i < destinations.length; i++){
            var dest = destinations[i];
            var cityTo = searchCityByName(dest.name);
            cityTo.price = dest.price;
            result.push(cityTo);
        }
        var context={home:home, destinations:result};
        var rendered_template=from_template(context);
        $('#from').html(rendered_template);
        $(".from").click(handleClickOnFromELements);
    }

    /*
     * Other utility functions
     */

    // Lookup a country by name -> a country or an empty object
    function searchCountryByName(name){
        for(var i=0; i < countries.length; i++){
            var country = countries[i];
            if(country.name == name)
                return country;
        }
        return{};

    }

    // Lookup a city by name -> a city or an empty object
    function searchCityByName(name){
        for(var i=0; i < cities.length; i++ ){
            var city=cities[i];
            if (city.name == name)
                return city;
        }
        return{}
    }

    // Lookup cities by countries -> a list of city objects
    function searchCitiesByCountry(codes){
        var result=[];
        for(var i=0; i<cities.length; i++) {
            var city = cities[i];
            if (codes.indexOf(city.country) >=0) {
                result.push(city);
            }
        }
        return result;
    };

});
