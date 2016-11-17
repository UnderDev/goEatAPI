// This program provides a sample application for using MongoDB with
// the mgo driver.
// Adapted from https://gist.github.com/ardan-bkennedy/9198289
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	//"context"
	"encoding/json"

	"gopkg.in/macaron.v1"
)

//login stuff required to connect to mongodb
const (
	MongoDBHosts = "ds035846.mlab.com:35846"
	AuthDatabase = "heroku_7bd4bdpc"
	AuthUserName = "goteamadmin"
	AuthPassword = "goteam1"
	TestDatabase = "heroku_7bd4bdpc"
)

var mongoDBDialInfo = &mgo.DialInfo{
	Addrs:    []string{MongoDBHosts},
	Timeout:  60 * time.Second,
	Database: AuthDatabase,
	Username: AuthUserName,
	Password: AuthPassword,
}

//user struct
type Person struct {
	Name       string       `bson:"name" json:"name`
	Fbpass     string       `bson:"fbpass" json:"fbpass`
	Photo      string       `bson:"photo" json:"photo"`
	Favourites []Favs       `bson:"favourites" json:"favourites`
	Blacklist  []Blacklists `bson: "blacklist" json:"blacklist`
}

//user favourites used in user struct
type Favs struct {
	Favname       string
	Favlatitude   string
	Favlongtitude string
	Favphoto	  string
	Favid		  string
}

//user favourites used in user struct
type Blacklists struct {
	Blname       string
	Bllatitude   string
	Bllongtitude string
}

//opens and returns connection to Mongodb
func getCollection() *mgo.Collection {

	mongoSession, err := mgo.DialWithInfo(mongoDBDialInfo)
	if err != nil {
		log.Fatalf("CreateSession: %s\n", err)
	}
	mongoSession.SetMode(mgo.Monotonic, true)
	sessionCopy := mongoSession.Copy()
	//defer sessionCopy.Close() <------figure out where to put this!

	// Get a collection to execute the query against.
	collection := sessionCopy.DB(TestDatabase).C("Users")
	return collection
}

func returnAllPersons(res http.ResponseWriter, req *http.Request) { //return all records in collection
	collection := getCollection()

	// Retrieve the list of Persons - array object
	var result []Person
	err := collection.Find(nil).All(&result)
	if err != nil {
		log.Printf("RunQuery : ERROR : %s\n", err)
		return
	}

	places := result
	if err != nil {
		log.Fatalf("fatal error: %s", err)
	} else {

		json.NewEncoder(res).Encode(places)
	}

} //returnAllPersons

func returnInsertPerson(fbId string, fbName string) { //insert person into database
	collection := getCollection()

	//Person builder - will be replaced with http request
	name := fbName
	fbpass := fbId
	photo := "https://images-na.ssl-images-amazon.com/images/I/71vYbOepKWL._UX250_.jpg"
	favname := "KFC"
	favlat := "34.453453"
	favlong := "23.643563"
	myfavourites := []Favs{{Favname: favname, Favlatitude: favlat, Favlongtitude: favlong}}

	// Insert into db
	err := collection.Insert(&Person{Name: name, Fbpass: fbpass, Photo: photo, Favourites: myfavourites})

	if err != nil {
		panic(err)
	}

	fmt.Println("Inserted to database")

} //returnInsertPerson

func returnFindPerson(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { //find individual person

	//find user by unique id
	findId := ctx.Params("id")
	json.NewEncoder(res).Encode(goFind(findId))

} //returnFindPerson
func goFind(findId string) Person {
	collection := getCollection()
	result := Person{}

	err := collection.Find(bson.M{"fbpass": findId}).One(&result)
	if err != nil {
		//panic("err")
	}

	fmt.Println("Find user by id")
	places := result
	if err == nil {
		fmt.Println("returning real json")
	}
	return places
}

func returnUpdatePerson(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Update user email based on searched name
	collection := getCollection()

	findName := ctx.Params("id")
	email := ctx.Params("email")

	colQuerier := bson.M{"name": findName}           //find user
	change := bson.M{"$set": bson.M{"email": email}} //set new email value
	err := collection.Update(colQuerier, change)
	if err != nil {
		panic(err)
	}

	fmt.Println("Update \n")

} //returnUpdatePerson

//adapted from http://stackoverflow.com/questions/29817535/mongodb-how-to-insert-additional-object-into-object-collection-in-golang
func returnUpdateFavourites(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Update user favourites based on searched name
	fmt.Println("--------->>>>>booo")
	collection := getCollection()

	findName := "Oliver Arnold"
	//findName := ctx.Params("fbpass")
	favname := ctx.Params("name")
	favid := ctx.Params("id")
	photo := ctx.Params("photo")
	favlat := ctx.Params("latitude")
	favlong := ctx.Params("longtitude")
	myfavourites := Favs{Favname: favname, Favid: favid, Favlatitude: favlat, Favlongtitude: favlong, Favphoto: photo}

	query := bson.M{"name": findName}                             //find user
	update := bson.M{"$push": bson.M{"favourites": myfavourites}} //set new email value

	err := collection.Update(query, update)
	if err != nil {
		panic(err)
	}

	fmt.Println("Update favourites \n")

} //returnUpdatePerson

func returnRemovePerson(i string) { // Remove user
	collection := getCollection()

	rmvname := i
	// remove entry
	err := collection.Remove(bson.M{"name": rmvname})
	if err != nil {
		panic(err)
	}

	fmt.Println("Remove \n")

} //returnRemovePerson

func returnSortByLocation() { // Sort collection by location
	collection := getCollection()

	var results []Person
	err := collection.Find(bson.M(nil)).Sort("location").All(&results) //find all users and sort results by location (or any attribute)

	if err != nil {
		panic(err)
	}

	for i := 0; i < len(results); i++ {
		fmt.Println("Person:", results[i])
	}

	fmt.Println("Sort by location: ", results)

} //returnSortByLocation

// main is the entry point for the application.
//func main() {

// 	//uncomment to call functions

//returnAllPersons()
//returnInsertPerson()
// 	returnFindPerson("Sarah Figgs")
// 	//returnUpdatePerson("John Smith", "myemail@email.com")
// 	//returnRemovePerson("Rocky Flintstone")
// 	//returnAllPersons()
// 	//returnSortByLocation()

//}//main
