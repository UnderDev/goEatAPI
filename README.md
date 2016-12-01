# goEat
Created as part of the GMIT BSc(Honours) in Computing in Software Development, Emerging Technologies module.

A live version can be found on [Heroku](https://goeatapi.herokuapp.com/)

Be aware, due to the use of free limited usage Google API keys, **nearby places and their images may not load properly**. These usage limits are refreshed after 24 hours. Additionally, devices and browsers supporting HTML with geolocation are required. 

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

![Architecture Diagram](https://cloud.githubusercontent.com/assets/10116669/20705788/4dbd198a-b61c-11e6-968b-e94ca1451d97.png)

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

#####Google Places Endpoints
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
```JSON
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
    {}
]
```

#####The Google Maps Directions Endpoint
```
	/direction/{lat},{long},{id}
```
The directions endpoint consumes the user's current geolocation and the destination's Google Places ID. The API will return JSON in a format resembling the following:
```JSON
[  
    {  
        "summary":"",
        "legs":[  
            {  
                "steps":[  
                    {  
                        "html_instructions":"Head",
                        "distance":{  
                            "text":"1 m",
                            "value":0
                        },
                        "start_location":{  
                            "lat":53.2912748,
                            "lng":-8.989321
                        },
                        "end_location":{  
                            "lat":53.2912748,
                            "lng":-8.989321
                        },
                        "polyline":{  
                            "points":"mmgdIfvzu@"
                        },
                        "steps":null,
                        "transit_details":null,
                        "travel_mode":"DRIVING",
                        "duration":{  
                            "value":0,
                            "text":""
                        }
                    }
                ],
                "distance":{  
                    "text":"1 m",
                    "value":0
                },
                "start_location":{  
                    "lat":53.2912748,
                    "lng":-8.989321
                },
                "end_location":{  
                    "lat":53.2912748,
                    "lng":-8.989321
                },
                "start_address":"Apartment 18, Teach Briota, Monivea Rd, Galway, Ireland",
                "end_address":"Clayton Hotel Galway, Ballybrit, Galway, Ireland",
                "duration":{  
                    "value":0,
                    "text":""
                },
                "duration_in_traffic":{  
                    "value":0,
                    "text":""
                },
                "arrival_time":null,
                "departure_time":null
            }
        ],
        "waypoint_order":[  

        ],
        "overview_polyline":{  
            "points":"mmgdIfvzu@"
        },
        "bounds":{  
            "northeast":{  
                "lat":53.2912748,
                "lng":-8.989321
            },
            "southwest":{  
                "lat":53.2912748,
                "lng":-8.989321
            }
        },
        "copyrights":"Map data ©2016 Google",
        "warnings":[  

        ]
    }
]
```





#####goEat User Endpoints

User profile information is managed using the following endpoints:
```
	/accessKey/:id

	/returnUpdateFavourites/:fbpass/:id/:name/:photo/:latitude/:longtitude
	/returnUpdateBlacklist/:fbpass/:id/:name/:photo/:latitude/:longtitude
	/returnUpdateHistory/:fbpass/:id/:name/:photo/:latitude/:longtitude
	/returnRemoveFav/:fbpass/:fav
	/returnRemoveBlist/:fbpass/:blist
	/returnRemoveHistory/:fbpass
```
Each provides one basic CRUD operation related to the user's favorites, history, and blacklist. 


All current users can be requested as well, however this feature is mainly used for development and debugging purposes.
```
	/returnAllPersons
```

Individual users can be requested using 
```
	      /returnFindPerson/{fbpass}
```
An example request could be:
```
  /returnFindPerson/10207337063737016
```
This request passes the users Facebook id which is returned when they log into the app with Facebook.  This request would return a Person object, which would look as follows:
```JSON
{
    "_id": {
        "$oid": "583744fd36f40474fa835b41"
    },
    "name": "John Doe",
    "fbpass": "10207337063731234",
    "photo": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/11090_10203670417271234_8022226923608097096_n.jpg?oh=29907a390b448649868411f5c105edb8&oe=58C562B6",
    "favourites": [
        {
            "favname": "Kettle of Fish",
            "favlatitude": "53.271752",
            "favlongtitude": "-9.054240799999999",
            "favphoto": "CoQBdwAAAGQUzmZT-h_piRRpo5Kn4AG8zO2Dw_nDF4tIo89-FZ0flAm8VA2N7Y4IzssvQxx-98HY933VI_JQt_UeJ8J6S1OunCe0_K-JyMvm3EUqch7uJtIcXorZBWQKTn9AB4VPj4Pg7mAUZy7UsuqwOkMDOG6Rt6yrTZ0ILz8b4s47GIZ3EhCorNciXPo9UrcPrPESdZRoGhS8u-zV2OxMz2LlNTK82Zp8aAtbdg",
            "favid": "ChIJLZXH3vqWW0gRXbOmL5ql-DY"
        },
    ],
    "blacklist": [
        {
            "blname": "Clayton Hotel Galway",
            "bllatitude": "53.291342",
            "bllongtitude": "-8.989296999999999",
            "blphoto": "CoQBdwAAAOR33ipVkpVwDYwVAAGFnVCnfohzyoEZxcNZhEFSyLelOsTzPkRGcBGS9Ivr6jCfJ3MKaV5A6r5Paz2abCAdo5bET8x6a8QSJaQurVJLy8OwA9_E_sJlXc0YF3LgRTsQQJSKBuMcuSMu5uDAIjpvISDmUj8t5IXsXY3AuDj5DfTBEhCqjfXbg1FNmiGUjnqWETpgGhSwqAgXHwULqwEiLldvZ7O-8cueCg",
            "blid": "ChIJn_a2RkCRW0gRgEnIeIH0TGY"
        }
    ],
    "history": [
        {
            "hisname": "Front Door",
            "hislatitude": "53.2715985",
            "hislongtitude": "-9.0536359",
            "hisphoto": "CoQBdwAAADDJn7m7kJJVjARtIqS6kA64BcmxxRde2XiMot7CL0g2iw-r-Xmtn-l8bVqt1viH7EVvS_DBKHAjTiId2i8S2ojChsSCOSwdk5uQH02Ls7ujSrt2wg2aYLtt88Zd5C89rQ14sUCF7AvfLCkcrReUactvCDNxiX7MGeFNM5yrXqPeEhAKfIUtZAgQUXTeAwlqqRdvGhS0IwM-4cMa7mShmKQk2YO-HWfC-A",
            "hisid": "ChIJ_aKF2fqWW0gRDLLSSGNL_hc"
        },
        {
            "hisname": "Garveys Inn",
            "hislatitude": "53.274279",
            "hislongtitude": "-9.047906",
            "hisphoto": "CoQBdwAAAJ18XswqYMTHBflJBAa6h9WU7bmUgy30b8skgSTKk8aBU-jviSpizMarTESuDC3mDpxTqjGaYG3dPhEoRuDii9rfgIrcPEzebJ5HHN-yjPPWPIaDPAp_Sh6Jas766SmnuI9Trv7Of1FqvWVvmb9UthWWES07o2vf8x4pmkA16psUEhAFeR3o0yioe2xjr-zM7rSYGhTCaPfcfoKtl8N3x4HM11v-vcAOMA",
            "hisid": "ChIJb7nd9OWWW0gRqXVx5z1QKUY"
        },
        {
            "hisname": "Clayton Hotel Galway",
            "hislatitude": "53.291342",
            "hislongtitude": "-8.989296999999999",
            "hisphoto": "CoQBdwAAANzQ_AxD_IR7Y4GIsoBe2IK0p8vbSpEOP-Y9rirFISnVYOqA4R2O6BlUn9akMqGTJOlu8UNHBF2Ak8WljfpbPoXNGidDLghY7kYTCzjtJ04IpWTxOQmBsKH8WuyKawK6XkSXMvr057Dk96Cnaaj_cqUm5SUSR06s9eqpF7J566WIEhDkzaEZqU3JbzJW3IVVwA__GhSF8HYG3-VUuUjVl9J_5YcEKxjiSA",
            "hisid": "ChIJn_a2RkCRW0gRgEnIeIH0TGY"
        }
    ]
}

```

```
	/returnUpdateHistory/{fbpass}{id}{name}{photo}{latitutde}{longtitude}
```	
An example request could be:
```
  /returnFindPerson/10207337063737016/ChIJn_a2RkCRW0gRgEnIeIH0TGY/Clayton%20Hotel %20Galway/CoQBdwAAABfAQkmK-sGzXeyI2Zp_r_k_2qORTiJirPNssCbO0VnjdRN0LUEQU9yoJTcOrNHuvzlKoYoRZ6QT1UmmKSYLhpog_6ZcUeClBNMf4P72ypiPHw4C3FgdY_oHOLuFprN0Iz1OAIr7uZCl4bubJb9S5Ip8pVFdxWT4QVseMSnEbQOrEhCSOZm5WSpPl4w8IDp6em-uGhQE7ylnCD_Zy4ZPgOWcshnvkmVuyQ/53.291342/-8.989296999999999
```
This request passes the users Facebook id to find the correct document in MongoDB.  This request searches for the user document and creates a new item in their history array containing the eatery id, name, photo reference, latitude and longtitude coordinates.


```	
	/returnRemoveFav/{fbpass}{fav}
```
An example request could be:
```
  /returnFindPerson/10207337063737016/ChIJn_a2RkCRW0gRgEnIeIH0TGY
```
This request passes the users Facebook id to find the correct document in MongoDB.  This request searches for the user document and searches for the ID of all the locations stored in their favourites list for the specified ID and removes it.


