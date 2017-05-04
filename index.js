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
         destinations:[{name:'Paris', price:20},
                       {name:'Lviv', price:180}
                      ]
        },
        {name:'Lyon',
         country:'fr',
         destinations:[{name:'Berlin', price:100},
                       {name:'Dresden', price:80}, {name:'Florence', price:120}
                      ]
        },
        {name:'Lviv',
         country:'ua',
         destinations:[{name:'Verona', price:80},
                       {name:'Paris', price:100},
                       {name:'Berlin', price:90},
                       {name:'Kyiv', price:20}
                      ]
        },
        {name:'Kyiv',
         country:'ua',
         destinations:[{name:'Paris', price:200},
                       {name:'Marseille', price:180},
                       {name:'Lviv', price:20}
                      ]
        },
        {name:'Roma',
         country:'it',
         destinations:[{name:'Lyon', price:80},
                       {name:'Berlin', price:100},
                       {name:'Paris', price:90},
                       {name:'Lviv', price:110}
                      ]
        },
        {name:'Florence',
         country:'it',
         destinations:[{name:'Roma', price:20},
                       {name:'Berlin', price:100},
                       {name:'Paris', price:90}
                      ]
        },
        {name:'Verona',
         country:'it',
         destinations:[{name:'Dresden', price:70},
                       {name:'Kyiv', price:190},
                       {name:'Roma', price:20}
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
         destinations:[{name:'Berlin', price:20},
                       {name:'Verona', price:90}
                      ]
        }
    ];


    // Handlebar helper to count from 1
    // http://stackoverflow.com/questions/22103989/adding-offset-to-index-when-looping-through-items-in-handlebars
    Handlebars.registerHelper("inc", function(value, options)                              {
        return parseInt(value) + 1;
    });

    // The Handlebars template which is going to build the results table
    var go_source = $('#go-template').html();
    var go_template = Handlebars.compile(go_source);

    var from_source = $('#from-template').html();
    var from_template = Handlebars.compile(from_source);

    var connection_source=$('#connection-template').html();
    var connection_template=Handlebars.compile(connection_source);

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
        var context={home:home,
                     destinations:cityFrom.destinations,
                     cities:cities};
        var rendered_template=from_template(context);
        $('#from').html(rendered_template);

        // Even handlers for the elements created by Handlebars
        $(".from").click(handleClickOnFromELements);
        $("#search").click(function(){
            //$(".navbar").hide();
            //$("#go").hide();
            //$("#from").hide();

            var home = $(this).val();
            var dest = $('#destination-select').val();
            //var price = function getTotal()
            //var total=findConnectionsBetween()

            var result= findConnectionsBetween(home, dest);
            // The result is a list of objects {name:..., price:...}

            var context={home:home, result:result, dest:dest, nb:result.length};
            var rendered_template=connection_template(context);
            $('#connection').html(rendered_template);
        })

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


    function findCitiesGoingTo (destName) {
        var destCity = searchCityByName(destName);
        var result=[];
        for (var i=0; i < cities.length; i++) {
            var city = cities[i];
            for (var j=0; j<city.destinations.length;j++) {
                var d = city.destinations[j];
                if (d.name==destName)
                    result.push(city);
            }

        }
        return result;
    }


    function findConnectionsBetween (a, b) {
        console.log('Looking for connections between', a, 'and', b);
        var homeCity = searchCityByName(a);
        console.debug('Home city is', homeCity.name);
        var result=[];
        for (var i=0; i < homeCity.destinations.length; i++) {
            var d1= homeCity.destinations[i];
            //console.debug('Looking for connections from', d1.name);
            var c=searchCityByName(d1.name);


            //var f1=searchCityByName(d1.price);


            //console.debug('Now we are in', c.name);
            //console.debug('From there we can go to:');
            for(var j=0; j<c.destinations.length; j++) {
                var d2 = c.destinations[j];

                //var f2=d2.price;
                //var total= f1+f2;
                //total.push(c);

                //console.debug('- ', d2.name);
                if(d2.name== b) {
                    //console.debug('This is good!');
                    var total_price = d1.price + d2.price;
                    result.push({name:c.name, price: total_price});
                    break;
                }
                else {
                    //console.debug('Naaah...');
                }
            }


        }
        console.log('Final results:', result);
        return result;
    };

    /*function getTotal(a,b){
        var homeCity = searchCityByName(a);
        var result=[];
        for (var i=0; i < homeCity.destinations.length; i++) {
            var d1= homeCity.destinations[i];
            var c=searchCityByName(d1.price);
            for(var j=0; j<c.destinations.length; j++) {
                var d2 = c.destinations[j];
    }
        }
        console.log()
    }
    */

    // Test code

    /*
    findConnectionsBetween('Berlin', 'Paris');
    */

});
