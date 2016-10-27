'use strict';

angular.module('myApp.find', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/find', {
      templateUrl: 'views/find.html',
      controller: 'FindCtrl'
    });
  }])

  .controller('FindCtrl', ['$scope', 'PlacesService','geolocationSvc', function ($scope, PlacesService, geolocationSvc) {

    $scope.getDirections = function captureUserLocation() {
        geolocationSvc.getCurrentPosition().then(function(location){
          console.log(location);
        });
      };
    

    var bypassGoogle = true;
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
      PlacesService.getData().then(function (data) {
        $scope.places = data;
      }, function () {
        $scope.data = undefined;
      });
    }



    $scope.getURL = function (stuff) {
      if (bypassGoogle == true) {
        return "http://placehold.it/300"
      } else {
        if (stuff != undefined)
          return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + stuff + "&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
      }
    }


  }])

  //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
  .factory('PlacesService', function ($q, $http, $rootScope) {
    var myData = {};

    return {
      getData: function () {
        var deferred = $q.defer();

        $http.get('/maps/nearby/restaurants')
          .success(function (data) {
            console.log(data);
            myData = data;
            deferred.resolve(myData);
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }
    }
  }).factory('geolocationSvc', ['$q', '$window', function ($q, $window) {

//adapted from http://stackoverflow.com/questions/23185619/how-can-i-use-html5-geolocation-in-angularjs
    'use strict';

    function getCurrentPosition() {
        var deferred = $q.defer();
        if (!$window.navigator.geolocation) {
            deferred.reject('Geolocation not supported.');
        } else {
            $window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    deferred.resolve(position);
                },
                function (err) {
                    deferred.reject(err);
                });
        }
        return deferred.promise;
    }
    return {
        getCurrentPosition: getCurrentPosition
    };
}]);

