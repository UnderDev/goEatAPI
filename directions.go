package main

import (
	"encoding/json"
	"log"
	"net/http"

	macaron "gopkg.in/macaron.v1"

	"golang.org/x/net/context"
	"googlemaps.github.io/maps"
)

//
func main() {
	m := macaron.Classic()
	initRoutes(m)
	m.Run()
}

/*https://github.com/googlemaps/google-maps-services-go*/
func getRoutes(res http.ResponseWriter, req *http.Request, filter maps.Step) {
	c, err := maps.NewClient(maps.WithAPIKey("AIzaSyB5ZgNt2r2S-v7LI-SQdMpsORxPTpgPoAY"))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	r := &maps.DirectionsRequest{
		Origin:      "place_id:ChIJ4VVLVC2RW0gRrVl2c9mLeCs", //place id/lat,long OR address  GMIT, Galway City, Ireland
		Destination: "place_id:ChIJL6wn6oAOZ0gRoHExl6nHAAo",
	}

	routes, _, err := c.Directions(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
	json.NewEncoder(res).Encode(routes) //should work
}

func initRoutes(m *macaron.Macaron) {

	m.Get("/routes", getRoutes)
}
