# goEat
Created as part of the GMIT BofSc(Honours) in Computing in Software Development, Emerging Technologies module.
##Introduction
goEat is a service that provides a list of nearby places where you can get your mastication on. Using your current Geolocation,
goEat finds restaurants and places providing takeaway and delivery options, that are within 10km of you.


##Project Architecture

The goEat API itself is written in [Go](https://golang.org/) using the [Macaron Framework](https://go-macaron.com/).
It has been built and packaged for deployment to the [Heroku PaaS](https://www.heroku.com/), which relies on [GoDep](https://github.com/tools/godep) for package management.
The API also serves a single page application(SPA) written in [AngularJS](https://angularjs.org/), which uses the various endpoints that
were designed around it. The goEatAPI uses the [Google Places](https://developers.google.com/places/) and [Google Maps](https://developers.google.com/maps/) APIs for retrieving a list of nearby dining locations
and directions to them, respectively. Interactions with Google Maps services are provided by the [Go Client for Google Maps Services](https://github.com/googlemaps/google-maps-services-go)
library. User's can sign up/in using their Facebook account if they want to keep track of favorites, or just blacklist that place down the street who don't know what "medium-rare" means. 

###Technologies

* [Go](https://golang.org/)
* [Macaron Framework](https://go-macaron.com/)
* [AngularJS](https://angularjs.org/)
* [Heroku PaaS](https://www.heroku.com/)
* [MongoDB](https://www.mongodb.com/)
* [Google Places](https://developers.google.com/places/)
* [Google Maps](https://developers.google.com/maps/)
* [Facebook Login](https://developers.facebook.com/products/login)


####Endpoints

#####Google Places Enpoints
```
	/maps
		/nearby
		  /restaurants/{lat},{long}
		  /delivery/{lat},{long}
		  /takeaway/{lat},{long}
```
An example request could be:
```
  /maps/nearby/delivery/53.2785689,-9.0104879
```
Which would return an array of Places, each roughly resembling the following:
```
[  
    {  
        "formatted_address":"",
        "geometry":{  
            "location":{  
                "lat":53.2754939,
                "lng":-9.0484464
            },
            "location_type":"",
            "viewport":{  
                "northeast":{  
                    "lat":53.27557669999999,
                    "lng":-9.048378849999999
                },
                "southwest":{  
                    "lat":53.27546630000001,
                    "lng":-9.048649049999998
                }
            },
            "types":null
        },
        "name":"Domino's Pizza - Galway - East",
        "icon":"https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
        "place_id":"ChIJO-rvY--WW0gRVRd9tTHGigI",
        "scope":"GOOGLE",
        "rating":3.5,
        "types":[  
            "meal_delivery",
            "meal_takeaway",
            "restaurant",
            "food",
            "point_of_interest",
            "establishment"
        ],
        "opening_hours":{  
            "open_now":true,
            "periods":null,
            "weekday_text":[  

            ],
            "permanently_closed":null
        },
        "photos":[  
            {  
                "photo_reference":"CoQBdwAAALzRpauWkg2ao7eZcXqLZNnmXwYu8MasLKFwo-r-QikJJiZEOy-qHCHItHzOy_iLr-oxhR68PFOYERjp7JhbmbV6HmYil_eJ9wm5jEw5UFXZ37rZCtoDc2X8eXzivO2sd4OaHd5Cs1AuoJJLdyxAef3GffRcJFh4f_9cY7sgqC7REhDVj_QuBkv3QbHDVVfNnRe8GhQe-4N-XFjFDQZKromiEOSmTPORWg",
                "height":974,
                "width":1299,
                "html_attributions":[  
                    "\u003ca href=\"https://maps.google.com/maps/contrib/108343015636638353856/photos\"\u003eDomino\u0026#39;s Pizza - Galway - East\u003c/a\u003e"
                ]
            }
        ],
        "alt_ids":null,
        "price_level":1,
        "vicinity":"16 Prospect Hill, Galway",
        "permanently_closed":false
    },
    ...
]
```
```
	/direction/:stuff
```

```
	/accessKey/:id
	/returnAllPersons
	/returnFindPerson/:fbpass
	/returnUpdateFavourites/:fbpass/:id/:name/:photo/:latitude/:longtitude
	/returnUpdateBlacklist/:fbpass/:id/:name/:photo/:latitude/:longtitude
	/returnUpdateHistory/:fbpass/:id/:name/:photo/:latitude/:longtitude
	/returnRemoveFav/:fbpass/:fav
	/returnRemoveBlist/:fbpass/:blist
	/returnRemoveHistory/:fbpass
```
