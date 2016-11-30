// This program provides a sample application for using MongoDB with
// the mgo driver.
// Adapted from https://gist.github.com/ardan-bkennedy/9198289
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"encoding/json"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"gopkg.in/macaron.v1"
)

//login details required to connect to mongodb
const (
	MongoDBHosts = "ds035846.mlab.com:35846"
	AuthDatabase = "heroku_7bd4bdpc"
	AuthUserName = "goteamadmin"
	AuthPassword = "goteam1"
	TestDatabase = "heroku_7bd4bdpc"
)

//connection details for database
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
	History    []History    `bson: "history" json:"history`
}

//user favourites used in user struct
type Favs struct {
	Favname       string
	Favlatitude   string
	Favlongtitude string
	Favphoto      string
	Favid         string
}

//user blacklist used in user struct
type Blacklists struct {
	Blname       string
	Bllatitude   string
	Bllongtitude string
	Blphoto      string
	Blid         string
}

//user history used in user struct
type History struct {
	Hisname       string
	Hislatitude   string
	Hislongtitude string
	Hisphoto      string
	Hisid         string
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

//find person in database
func returnFindPerson(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) {

	//find user by facebook id
	findId := ctx.Params("fbpass")
	json.NewEncoder(res).Encode(goFind(findId)) //calls goFind func and pass fb id

} //returnFindPerson

//
func goFind(findId string) Person {
	collection := getCollection() //get session to database
	result := Person{}            //use person struct to build person from response

	collection.Find(bson.M{"fbpass": findId}).One(&result) //mongo statement to find user, save response to result

	return result
}

//adapted from http://stackoverflow.com/questions/29817535/mongodb-how-to-insert-additional-object-into-object-collection-in-golang
func returnUpdateFavourites(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Update user favourites based on searched fb id

	collection := getCollection()

	findUser := ctx.Params("fbpass")
	//build favourite struct from passed params
	name := ctx.Params("name")
	id := ctx.Params("id")
	photo := ctx.Params("photo")
	lat := ctx.Params("latitude")
	long := ctx.Params("longtitude")
	//combined favourites array
	myfavourites := Favs{Favname: name, Favid: id, Favlatitude: lat, Favlongtitude: long, Favphoto: photo}

	query := bson.M{"fbpass": findUser}                           //user to search by facebook id
	update := bson.M{"$push": bson.M{"favourites": myfavourites}} //update to be pushed to database

	err := collection.Update(query, update) //add favourite update to user collection
	if err != nil {
		panic(err)
	}

} //returnUpdateFavourites

//same as above method but for Blacklist entries
func returnUpdateBlacklist(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Update user Blacklist based on searched fb id

	collection := getCollection()

	findUser := ctx.Params("fbpass")
	name := ctx.Params("name")
	id := ctx.Params("id")
	photo := ctx.Params("photo")
	lat := ctx.Params("latitude")
	long := ctx.Params("longtitude")
	myBlackList := Blacklists{Blname: name, Blid: id, Bllatitude: lat, Bllongtitude: long, Blphoto: photo}

	query := bson.M{"fbpass": findUser}
	update := bson.M{"$push": bson.M{"blacklist": myBlackList}}

	err := collection.Update(query, update)
	if err != nil {
		panic(err)
	}

} //returnUpdateBlacklist

//same as above method but for History entries
func returnUpdateHistory(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Update user favourites based on searched name

	collection := getCollection()

	findUser := ctx.Params("fbpass")
	name := ctx.Params("name")
	id := ctx.Params("id")
	photo := ctx.Params("photo")
	lat := ctx.Params("latitude")
	long := ctx.Params("longtitude")
	myHistory := History{Hisname: name, Hisid: id, Hislatitude: lat, Hislongtitude: long, Hisphoto: photo}

	query := bson.M{"fbpass": findUser}                     //find user by facebook identifier
	update := bson.M{"$push": bson.M{"history": myHistory}} //add to favourites list

	err := collection.Update(query, update)
	if err != nil {
		panic(err)
	}

	fmt.Println("Update history \n")

} //returnUpdatePerson

//adapted from http://stackoverflow.com/questions/37345170/how-to-do-multi-level-pull-of-array-element-in-mgo
func returnRemoveFav(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Remove favourite from collection

	collection := getCollection()
	findUser := ctx.Params("fbpass")
	fav := ctx.Params("fav")

	query := bson.M{"favourites": bson.M{"favid": fav}} //favourite to be deleted based on id
	//update user collection by removing favourite from array in db
	err := collection.Update(bson.M{"fbpass": findUser, "favourites.favid": fav}, bson.M{"$pull": query})
	if err != nil {
		panic(err)
	}

} //returnRemoveFav

//same as above method but for blacklist array
func returnRemoveBlist(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) { // Remove user

	collection := getCollection()
	findUser := ctx.Params("fbpass")
	blist := ctx.Params("blist")
	fmt.Println(findUser, blist)
	query := bson.M{"blacklist": bson.M{"blid": blist}}
	err := collection.Update(bson.M{"fbpass": findUser, "blacklist.blid": blist}, bson.M{"$pull": query})
	if err != nil {
		panic(err)
	}

} //returnRemoveBlist

//array for clearing user history from collection
func returnRemoveHistory(res http.ResponseWriter, req *http.Request, ctx *macaron.Context) {

	collection := getCollection()
	findUser := ctx.Params("fbpass")
	//empty history array to replace existing one on database
	history := []History{}

	query := bson.M{"fbpass": findUser}                  //find user based on facebook id
	change := bson.M{"$set": bson.M{"history": history}} //query to replace existing array with blank array
	err := collection.Update(query, change)              //update collection with above queries
	if err != nil {
		panic(err)
	}

	fmt.Println("Remove \n")

} //returnRemoveHistory

//insert person into database using facebook details
func returnInsertPerson(fbId string, fbName string, fbPhoto string) {
	collection := getCollection()

	//Person builder for database entry
	name := fbName
	fbpass := fbId
	photo := fbPhoto
	myfavourites := []Favs{}

	// Insert into db
	err := collection.Insert(&Person{Name: name, Fbpass: fbpass, Photo: photo, Favourites: myfavourites})

	if err != nil {
		panic(err)
	}

} //returnInsertPerson

//**************************************unused methods*******************************
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
} //returnSortByLocation

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
/*
	for i := 0; i < len(results); i++ {
		fmt.Println("Person:", results[i])
	}
	fmt.Println("Sort by location: ", results)
*/
