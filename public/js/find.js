'use strict';

angular.module('myApp.find', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/find', {
            templateUrl: 'views/find.html',
            controller: 'FindCtrl'
        });
    }])

    .controller('FindCtrl', ['$scope', '$sce', 'PlacesService', 'geolocationSvc', 'DirectionService', 'UpdateService', 'PeopleService', '$route', 'RemoveServiceBlist', 'RemoveServiceFav', function($scope, $sce, PlacesService, geolocationSvc, DirectionService, UpdateService, PeopleService, $route, RemoveServiceBlist, RemoveServiceFav) {
        var bypassGoogle = false;
        $scope.delivery = 'delivery';
        $scope.restaurants = 'restaurants';
        $scope.takeaway = 'takeaway';


        var loc;
        //Function takes in the current place_id, and loop over the array steps for all directions, apending them onto a HtmlElement
        $scope.getDirections = function(place_id) {
            DirectionService.getData(loc, place_id).then(function(data) {
                var result = document.getElementById('result');
                result.innerHTML = "";
                data[0].legs[0].steps.forEach(function(Inst) {
                    result.innerHTML += Inst.html_instructions + "<br>"
                    //console.log(Inst); //Get directions as text from here
                });
            }, function() {
                $scope.data = undefined;
            });

        };

        //Used to display star ratings upto the num passed in
        $scope.ratings = function(stars) {
            var ratingArray = [];
            for (var i = 0; i < stars; i++)
                ratingArray.push(i)//push cur number to array
            return ratingArray;
        }

        //Round number passed in
        $scope.roundNum = function(num) {
            var wholeNum = Math.round(num);
            return wholeNum;
        }

        $scope.checkBlacklist = function(placeId) {
            var check = false;
            if ($scope.blist !== null) {//if blacklist is not empty, check for selected item
                //check if place is already in database
                for (var i = 0; i < $scope.blist.length; i++) {
                    if (placeId === $scope.blist[i].Blid) {
                        check = true;
                    }
                }//for
            }//if
            return check;
        }

        $scope.checkFavlist = function(placeId) {
            var check = false;
            if ($scope.favs !== null) {//if blacklist is not empty, check for selected item
                //check if place is already in database
                for (var i = 0; i < $scope.favs.length; i++) {
                    if (placeId === $scope.favs[i].Favid) {
                        check = true;
                    }
                }//for
            }//if
            return check;
        }

        //reload page when item is removed
        $scope.reloadRoute = function() {
            $route.reload();
        }

        $scope.showMap = true;
        $scope.showMe = function(placeID) {
            $scope.showMap = false;
            geolocationSvc.getCurrentPosition().then(function(location) {
                var latLong = location.coords.latitude + "," + location.coords.longitude;//get the curent lat/long from the location passed in                 
                //http://stackoverflow.com/questions/29444132/angular-interpolation-error-for-src-attribute 
                //Build the url needed to send the request with lat/long apended on
                $scope.placeID = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/directions?origin=" + latLong + "&destination=place_id:" + placeID + "&key=AIzaSyB5ZgNt2r2S-v7LI-SQdMpsORxPTpgPoAY");
            })
        }
        $scope.hideMe = function() {
            $scope.showMap = true;
        }


        //variables for checking if item is already on database
        $scope.favs = [];
        $scope.blist = [];
        $scope.history = [];

        //checks if browser supports local storage for facebook login details
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("usrId") != "loggedOut") {
                var fbpass = localStorage.getItem("usrId");
            }
            //for local testing
            //var fbpass = "10207337063737016";
            //pass facebook id to service to check whether user is in database and return person if found
            PeopleService.getData(fbpass).then(function(data) {
                //store favourites, blacklist and history arrays from response
                $scope.favs = data.Favourites;
                $scope.blist = data.Blacklist;
                $scope.hist = data.History;

            }, function() {
                $scope.data = undefined;
            });
        } else {
            //alert user that browser does not support local storage
            alert("Please update to a browser that supports HTML5")
        }//if



        //add favourite to database
        $scope.addFav = function(place) {
            //checks whether browser supports local storage for facebook id
            if (typeof (Storage) !== "undefined") {
                if (localStorage.getItem("usrId") != "loggedOut") {
                    var fbpass = localStorage.getItem("usrId");

                    //for local testing
                    //var fbpass = "10207337063737016";

                    var type = "fav"; //sets update type to favourite
                    var check = false;

                    if ($scope.favs !== null) {//if favourites is not empty, check for selected item
                        //check if place is already in database
                        for (var i = 0; i < $scope.favs.length; i++) {
                            if (place.place_id === $scope.favs[i].Favid) {
                                check = true;
                            }
                        }//for
                    }//if
                    //if favourite is not already in database, send to database
                    if (check === false) {
                        //sends selected place object, users facebook id and type of list to be updated to service
                        UpdateService.updateList(place, fbpass, type).then(function() {

                            console.log("Updated favourites");
                            //reload page
                            $route.reload();
                        }, function() {
                            console.log("Unable to update");
                        });
                    }
                } else {
                    alert("Please update to a browser that supports HTML5")
                }
            }//if
        }//addFav

        //add blacklist item to database
        $scope.blacklist = function(place) {

            //checks whether browser supports local storage for facebook id
            if (typeof (Storage) !== "undefined") {
                if (localStorage.getItem("usrId") != "loggedOut") {
                    var fbpass = localStorage.getItem("usrId");

                    //for local testing
                    //var fbpass = "10207337063737016";
                    var type = "blist";//sets update type to blacklist

                    var check = false;

                    if ($scope.blist !== null) {//if blacklist is not empty, check for selected item
                        //check if place is already in database
                        for (var i = 0; i < $scope.blist.length; i++) {
                            if (place.place_id === $scope.blist[i].Blid) {
                                check = true;
                            }
                        }//for
                    }//if

                    //sends selected place object, users facebook id and type of list to be updated to service
                    //if place is not already in blacklist array on database, send to database
                    if (check === false) {
                        UpdateService.updateList(place, fbpass, type).then(function() {

                            console.log("Updated blacklist");
                            $route.reload();
                        }, function() {
                            console.log("Unable to update blacklist");
                        });
                    }//if
                } else {
                    alert("Please update to a browser that supports HTML5")
                }
            }//if
        }//blacklist

        //Remove blacklist item from database
        $scope.removeBlacklist = function(blist) {

            //console.log("this is remove func - ", blist);
            RemoveServiceBlist.remove(blist, fbpass).then(function() {
                console.log("removed sucessfully")
            }, function() {

            });
        } //remove

        //Removes favorite item from database
        $scope.removeFav = function (fav) {

            RemoveServiceFav.remove(fav, fbpass).then(function(){
                console.log("removed sucessfully")
            }, function(){

            });//RemoveServiceFav
        }//remove



        //add item to user history in database
        $scope.history = function(place) {
            //checks whether browser supports local storage for facebook id
            if (typeof (Storage) !== "undefined") {
                if (localStorage.getItem("usrId") != "loggedOut") {

                    var fbpass = localStorage.getItem("usrId");
                    //var fbpass = "10207337063737016";
                    var type = "history";//sets update type to history
                    var check = false;

                    if ($scope.hist !== null) { //if history is not empty, check for selected item
                        //check if place is already in database
                        for (var i = 0; i < $scope.hist.length; i++) {
                            if (place.place_id === $scope.hist[i].Hisid) {
                                check = true;
                            }
                        }//for
                    }//if
                    //if place is not already in history array in database, send to database
                    if (check === false) {
                        //sends selected place object, users facebook id and type of list to be updated to service
                        UpdateService.updateList(place, fbpass, type).then(function() {

                            console.log("Updated history");
                        }, function() {
                            console.log("Unable to update history");
                        });
                    }
                }
            } else {
                alert("Please update to a browser that supports HTML5")
            }//if
        }//history


        $scope.places = [];
        $scope.noneFound = true;

        //gets the list of places from the api
        $scope.doRefresh = function(category) {
            $scope.places = [];
            if (bypassGoogle == true) {
                $scope.places = [
                    {
                        "formatted_address": "",
                        "geometry": {
                            "location": {
                                "lat": 53.291342,
                                "lng": -8.989296999999999
                            },
                            "location_type": "",
                            "viewport": {
                                "northeast": {
                                    "lat": 0,
                                    "lng": 0
                                },
                                "southwest": {
                                    "lat": 0,
                                    "lng": 0
                                }
                            },
                            "types": null
                        },
                        "name": "Clayton Hotel Galway",
                        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png",
                        "place_id": "ChIJn_a2RkCRW0gRgEnIeIH0TGY",
                        "scope": "GOOGLE",
                        "rating": 4.2,
                        "types": [
                            "bar",
                            "lodging",
                            "restaurant",
                            "food",
                            "point_of_interest",
                            "establishment"
                        ],
                        "opening_hours": {
                            "open_now": true,
                            "periods": null,
                            "weekday_text": [],
                            "permanently_closed": null
                        },
                        "photos": [
                            {
                                "photo_reference": "CoQBdwAAAKbmIkT1MxozX_0gjHgEet1P7QloYLsfFrCnOqUVDWt8KkAixt5ee0CJFaUQidvM7QKtzisVl7tBaNfY0ghmZX6ziNtiTLwVyI1s1jTKQtFyyc7nG4zpGF2PQWXcEkStg0NPbK5j-q_llzY4jDIBsn3DnGZSDz7Q7wjLtfVbZPOJEhDSRL1j1KSEuYqNWA3PkC0LGhT6VDd_jv1Xs5b31vNcXv2GiQ8xpQ",
                                "height": 1836,
                                "width": 3264,
                                "html_attributions": [
                                    "<a href=\"https://maps.google.com/maps/contrib/108999846921738670539/photos\">Annabelle Joyce</a>"
                                ]
                            }
                        ],
                        "alt_ids": null,
                        "price_level": 0,
                        "vicinity": "Ballybrit, Galway",
                        "permanently_closed": false
                    },
                    {
                        "formatted_address": "",
                        "geometry": {
                            "location": {
                                "lat": 53.258616,
                                "lng": -9.08732
                            },
                            "location_type": "",
                            "viewport": {
                                "northeast": {
                                    "lat": 0,
                                    "lng": 0
                                },
                                "southwest": {
                                    "lat": 0,
                                    "lng": 0
                                }
                            },
                            "types": null
                        },
                        "name": "Salthill Hotel",
                        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png",
                        "place_id": "ChIJdzdp67SXW0gRxYK4OUBjOpY",
                        "scope": "GOOGLE",
                        "rating": 4,
                        "types": [
                            "lodging",
                            "restaurant",
                            "food",
                            "point_of_interest",
                            "establishment"
                        ],
                        "opening_hours": {
                            "open_now": true,
                            "periods": null,
                            "weekday_text": [],
                            "permanently_closed": null
                        },
                        "photos": [
                            {
                                "photo_reference": "CoQBdwAAAE0sEhWNCIztOevgfAfm2btIy5ICAW6HUXCO1hY4YIAlY4dcCxJ5g-Am3-cs8B6m1Q6BoTl9qzJUBkGAJYNg7zEVAxdQLI20C32ttUdzs4AMRG0S7xeZqmeVSgKTakV7MUKSCQb9CDfqFYt-f1U-UjO1GA8YwcIzuRzVsnWY7AbVEhD5F5Rmd5Yl84PSuLPWq90BGhTLLsC7ofc58WgjOpHlWsS8EeOBag",
                                "height": 900,
                                "width": 900,
                                "html_attributions": [
                                    "<a href=\"https://maps.google.com/maps/contrib/106023244038559739830/photos\">Salthill Hotel</a>"
                                ]
                            }
                        ],
                        "alt_ids": null,
                        "price_level": 0,
                        "vicinity": "Promenade, Galway",
                        "permanently_closed": false
                    },
                    {
                        "formatted_address": "",
                        "geometry": {
                            "location": {
                                "lat": 53.251337,
                                "lng": -9.152437
                            },
                            "location_type": "",
                            "viewport": {
                                "northeast": {
                                    "lat": 0,
                                    "lng": 0
                                },
                                "southwest": {
                                    "lat": 0,
                                    "lng": 0
                                }
                            },
                            "types": null
                        },
                        "name": "The Twelve Hotel Galway",
                        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png",
                        "place_id": "ChIJWyt7dAu9W0gRvOkdmZRx6Nk",
                        "scope": "GOOGLE",
                        "rating": 4.7,
                        "types": [
                            "bakery",
                            "bar",
                            "spa",
                            "lodging",
                            "restaurant",
                            "food",
                            "store",
                            "point_of_interest",
                            "establishment"
                        ],
                        "opening_hours": {
                            "open_now": true,
                            "periods": null,
                            "weekday_text": [],
                            "permanently_closed": null
                        },
                        "photos": [
                            {
                                "photo_reference": "CoQBcwAAAC_kUJ2S-W5GqxYu13VsrnXIIMbpxFte3f5ChKtQ7ft0m9prikhufa7yohnfrmtH4tzpOS6Vcn2HiVrG-PVikrjr26KxW1nu0uNW85FIzkex8hsSc87ZUl1M3M4Dwv9kGlkbJga0HwGGmQKj5kz-7X8o3XxsuL9jKfZiVQbOcJbnEhBXpdY8OtylkKUOu91ADUTHGhQALb9vPrvTvpGZiQ2DuOaLh4oukA",
                                "height": 3600,
                                "width": 2400,
                                "html_attributions": [
                                    "<a href=\"https://maps.google.com/maps/contrib/114328423673061768260/photos\">manon o&#39; halloran</a>"
                                ]
                            }
                        ],
                        "alt_ids": null,
                        "price_level": 0,
                        "vicinity": "Barna",
                        "permanently_closed": false
                    },
                    {
                        "formatted_address": "",
                        "geometry": {
                            "location": {
                                "lat": 53.278109,
                                "lng": -9.014904999999999
                            },
                            "location_type": "",
                            "viewport": {
                                "northeast": {
                                    "lat": 53.2782649,
                                    "lng": -9.014831249999999
                                },
                                "southwest": {
                                    "lat": 53.27764129999998,
                                    "lng": -9.01512625
                                }
                            },
                            "types": null
                        },
                        "name": "Flannery's Hotel Galway",
                        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png",
                        "place_id": "ChIJww16bc-WW0gRXAP1Ap7u3x0",
                        "scope": "GOOGLE",
                        "rating": 4.1,
                        "types": [
                            "lodging",
                            "restaurant",
                            "food",
                            "point_of_interest",
                            "establishment"
                        ],
                        "opening_hours": {
                            "open_now": true,
                            "periods": null,
                            "weekday_text": [],
                            "permanently_closed": null
                        },
                        "photos": [
                            {
                                "photo_reference": "CoQBcwAAANDzF4535lxHZLhudrE5u-lnueOo-r6cpPpOEoGLnh2dejqCM505fE75YMFCm7EEgnO31wZiB0oPPk1Bbz7M4TUsIEILVOMRiHq0OgyudLXgN2ik_xXwyqsZbdSD_6X97F_Z9Hok1R6WDACsr-Ms4lQDvT_HR2wXhe3zuUDjqg7qEhAOf39viZWTPbLeoL62ZLjNGhTZjLgDVrSvTILtTIKA_JvcuBgbyw",
                                "height": 250,
                                "width": 250,
                                "html_attributions": [
                                    "<a href=\"https://maps.google.com/maps/contrib/102018921072274763610/photos\">Flannery&#39;s Hotel Galway</a>"
                                ]
                            }
                        ],
                        "alt_ids": null,
                        "price_level": 0,
                        "vicinity": "Old Dublin Road, Galway City East",
                        "permanently_closed": false
                    },
                    {
                        "formatted_address": "",
                        "geometry": {
                            "location": {
                                "lat": 53.269471,
                                "lng": -9.108403
                            },
                            "location_type": "",
                            "viewport": {
                                "northeast": {
                                    "lat": 0,
                                    "lng": 0
                                },
                                "southwest": {
                                    "lat": 0,
                                    "lng": 0
                                }
                            },
                            "types": null
                        },
                        "name": "Clybaun Hotel",
                        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png",
                        "place_id": "ChIJQ59TYzCWW0gRLRBDTQfKMb4",
                        "scope": "GOOGLE",
                        "rating": 4,
                        "types": [
                            "gym",
                            "beauty_salon",
                            "bar",
                            "lodging",
                            "health",
                            "restaurant",
                            "food",
                            "point_of_interest",
                            "establishment"
                        ],
                        "opening_hours": {
                            "open_now": true,
                            "periods": null,
                            "weekday_text": [],
                            "permanently_closed": null
                        },
                        "photos": [
                            {
                                "photo_reference": "CoQBcwAAAGPuy27uRckI-Mc7q5drbvEo7PAKscUoyCZTu3Ynux8k6RvGitXtnrVbyaN1wGjD9QYnKyqG2ftRUcMMp9teweI2r35FxOCDOGIlE-knpxalp9omJaXOX0G5WFiAb8GnkPx2N3RIRysqEEbY6dNSYgoOrh1JufBDt_CpbGfVRpeuEhBA4GueIpLQA_scXHccYIeQGhS4ur31FQigWnu8yXkM9_b2vtvvzg",
                                "height": 2000,
                                "width": 3000,
                                "html_attributions": [
                                    "<a href=\"https://maps.google.com/maps/contrib/110435359819113696369/photos\">Clybaun Hotel</a>"
                                ]
                            }
                        ],
                        "alt_ids": null,
                        "price_level": 0,
                        "vicinity": "Clybaun Rd, Knocknacarra, Galway",
                        "permanently_closed": false
                    }
                ]
            } else {
                geolocationSvc.getCurrentPosition().then(function(location) {
                    loc = location;
                    PlacesService.getData(location, category).then(function(data) {
                        $scope.places = data;

                        if (typeof data[0] != "object") {
                            //since the Go api returns an array of chars that spells null, check to see if the array's types are actually objects
                            //this handles the event of no places being found by google                             
                            $scope.noneFound = true;
                        }
                        else {
                            $scope.noneFound = false;
                        }

                    }, function() {
                        $scope.data = undefined;
                    });
                })
            }
        }

        $scope.getURL = function(stuff) {
            if (bypassGoogle == true) {
                return "http://placehold.it/300"
            } else {
                if (stuff != undefined)
                    return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + stuff + "&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
            }
        }


        $scope.doRefresh($scope.restaurants);
    }]);