package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"gopkg.in/macaron.v1"

	"googlemaps.github.io/maps"
)

//for now this just prints places within 10km. Just tests the maps api
// docs @ https://godoc.org/googlemaps.github.io/maps
// for specific place types (to filter the places returned) see https://developers.google.com/places/supported_types

func restaurants(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) {
	nearby(res, req, ctx, maps.PlaceTypeRestaurant)
}
func delivery(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) {
	nearby(res, req, ctx, maps.PlaceTypeMealDelivery)
}
func takeaway(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) {
	nearby(res, req, ctx, maps.PlaceTypeMealTakeaway)
}

func nearby(res http.ResponseWriter, req *http.Request, ctx *macaron.Context, filter maps.PlaceType) {
	//c is the pointer to the maps client that is generated using the api key
	c, err := maps.NewClient(maps.WithAPIKey("AIzaSyB5ZgNt2r2S-v7LI-SQdMpsORxPTpgPoAY"))
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	}

	//get the lat/long params
	str := ctx.Params("pos")
	pos := strings.Split(str, ",")
	lat, err := strconv.ParseFloat(pos[0], 16)
	if err != nil {

	}
	lon, err := strconv.ParseFloat(pos[1], 16)
	if err != nil {

	}

	location := maps.LatLng{
		Lat: lat,
		Lng: lon}
	//

	//sort out getting latlong from browser and replace this hardcoded stuff

	//	type NearbySearchRequest struct {
	//    // Location is the latitude/longitude around which to retrieve place information. If you specify a location parameter, you must also specify a radius parameter.
	//    Location *LatLng
	//    // Radius defines the distance (in meters) within which to bias place results. The maximum allowed radius is 50,000 meters. Results inside of this region will be ranked higher than results outside of the search circle; however, prominent results from outside of the search radius may be included.
	//    Radius uint
	//    // Keyword is a term to be matched against all content that Google has indexed for this place, including but not limited to name, type, and address, as well as customer reviews and other third-party content.
	//    Keyword string
	//    // Language specifies the language in which to return results. Optional.
	//    Language string
	//    // MinPrice restricts results to only those places within the specified price level. Valid values are in the range from 0 (most affordable) to 4 (most expensive), inclusive.
	//    MinPrice PriceLevel
	//    // MaxPrice restricts results to only those places within the specified price level. Valid values are in the range from 0 (most affordable) to 4 (most expensive), inclusive.
	//    MaxPrice PriceLevel
	//    // Name is one or more terms to be matched against the names of places, separated with a space character.
	//    Name string
	//    // OpenNow returns only those places that are open for business at the time the query is sent. Places that do not specify opening hours in the Google Places database will not be returned if you include this parameter in your query.
	//    OpenNow bool
	//    // RankBy specifies the order in which results are listed.
	//    RankBy
	//    // Type restricts the results to places matching the specified type.
	//    Type PlaceType
	//    // PageToken returns the next 20 results from a previously run search. Setting a PageToken parameter will execute a search with the same parameters used previously — all parameters other than PageToken will be ignored.
	//    PageToken string
	//}
	r := &maps.NearbySearchRequest{
		Location: &location,
		Radius:   10000, //in meters
		OpenNow:  true,
		Type:     filter,
	}

	contx := context.Background()
	log.Print(r)
	psr, err := c.NearbySearch(contx, r)

	//loop over results and send it back
	if err != nil {
		if len(psr.Results) > 0 {
			log.Fatalf("ssssfatal error: %s", err)
		} else {
			log.Print(psr.Results)
			//this is going to return a null string, the browser will handle it
			json.NewEncoder(res).Encode(psr.Results)
		}

	} else {

		//type PlacesSearchResult struct {
		//    // FormattedAddress is the human-readable address of this place
		//    FormattedAddress string `json:"formatted_address"`
		//    // Geometry contains geometry information about the result, generally including the location (geocode) of the place and (optionally) the viewport identifying its general area of coverage.
		//    Geometry AddressGeometry `json:"geometry"`
		//    // Name contains the human-readable name for the returned result. For establishment results, this is usually the business name.
		//    Name string `json:"name"`
		//    // Icon contains the URL of a recommended icon which may be displayed to the user when indicating this result.
		//    Icon string `json:"icon"`
		//    // PlaceID is a textual identifier that uniquely identifies a place.
		//    PlaceID string `json:"place_id"`
		//    // Scope indicates the scope of the PlaceID.
		//    Scope string `json:"scope"`
		//    // Rating contains the place's rating, from 1.0 to 5.0, based on aggregated user reviews.
		//    Rating float32 `json:"rating"`
		//    // Types contains an array of feature types describing the given result.
		//    Types []string `json:"types"`
		//    // OpeningHours may contain whether the place is open now or not.
		//    OpeningHours *OpeningHours `json:"opening_hours"`
		//    // Photos is an array of photo objects, each containing a reference to an image.
		//    Photos []Photo `json:"photos"`
		//    // AltIDs — An array of zero, one or more alternative place IDs for the place, with a scope related to each alternative ID.
		//    AltIDs []AltID `json:"alt_ids"`
		//    // PriceLevel is the price level of the place, on a scale of 0 to 4.
		//    PriceLevel int `json:"price_level"`
		//    // Vicinity contains a feature name of a nearby location.
		//    Vicinity string `json:"vicinity"`
		//    // PermanentlyClosed is a boolean flag indicating whether the place has permanently shut down.
		//    PermanentlyClosed bool `json:"permanently_closed"`
		//}

		//for debugging purposes
		// str := ""
		// for _, plc := range psr.Results {
		// 	str += (plc.Name + " || ")

		// }
		// log.Print(str)

		places := psr.Results
		if err != nil {
			log.Fatalf("fatal error: %s", err)
		} else {
			//encode and send the places array back to the browser
			json.NewEncoder(res).Encode(places)
		}
	}

}
