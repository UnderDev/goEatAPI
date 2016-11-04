package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	macaron "gopkg.in/macaron.v1"

	"golang.org/x/net/context"
	"googlemaps.github.io/maps"
)

/*https://github.com/googlemaps/google-maps-services-go*/
func getDirections(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { //FILTER NOT WORKING
	c, err := maps.NewClient(maps.WithAPIKey("AIzaSyB5ZgNt2r2S-v7LI-SQdMpsORxPTpgPoAY"))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	str := ctx.Params("stuff")
	pos := strings.Split(str, ",")
	lat := pos[0]
	lon := pos[1]
	dest := pos[2]

	r := &maps.DirectionsRequest{
		Origin:      lat + "," + lon,
		Destination: "place_id:" + dest + "", //ChIJL6wn6oAOZ0gRoHExl6nHAAo
	}

	routes, _, err := c.Directions(context.Background(), r)
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}
	json.NewEncoder(res).Encode(routes)
}
