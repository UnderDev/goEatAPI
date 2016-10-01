package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"googlemaps.github.io/maps"
)

func main() {
	http.HandleFunc("/", hello)
	http.HandleFunc("/places", places)
	fmt.Println("Listening... " + os.Getenv("PORT"))
	err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
	if err != nil {
		panic(err)
	}

}

func hello(res http.ResponseWriter, req *http.Request) {
	fmt.Fprintln(res, "hello world!")
}

//for now this just prints places within 10km. Just tests the maps api
// docs @ https://godoc.org/googlemaps.github.io/maps
// for specific place types (to filter the places returned) see https://developers.google.com/places/supported_types
func places(res http.ResponseWriter, req *http.Request) {
	//c is the pointer to the maps client that is generated using the api key
	c, err := maps.NewClient(maps.WithAPIKey("AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"))

	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
	//sort out getting latlong from browser and replace this hardcoded stuff
	location := maps.LatLng{Lat: 53.274447, Lng: -9.049249}

	// request arguments, the latlong is hardcoded to eir square w/ radius of 10km until loc data from the user is sorted
	r := &maps.NearbySearchRequest{
		Location: &location,
		Radius:   10000, //in meters
	}
	//Change the context later, needs proper args
	ctx := context.Background()
	psr, err := c.NearbySearch(ctx, r)
	//loop over results and send it back
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	} else {

		str := ""
		for _, plc := range psr.Results {
			str += (plc.Name + " || ")
		}

		fmt.Fprintln(res, str)
	}

}
