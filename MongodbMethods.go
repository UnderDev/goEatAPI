// This program provides a sample application for using MongoDB with
// the mgo driver.
// Adapted from https://gist.github.com/ardan-bkennedy/9198289
package main

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
    "fmt"
	//"net/http"
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
        Name string `bson:"name" json:"name`
        Location string `bson:"location" json:"location`
        Fbname string `bson:"fbname" json:"fbname`
        Fbpass string `bson:"fbpass" json:"fbpass`
        Email string `bson:"email" json:"email`
        Latitude float64 `bson:"latitude" json:"latitude`
        Longtitude float64 `bson:"longitude" json:"longitude`
		Favourites []Favs `bson:"favourites" json:"favourites`
		Blacklist []Blacklists `bson: "blacklist" json:"blacklist`
  
}
//user favourites used in user struct
type Favs struct{
	Favname string
	Favlatitude string
	Favlongtitude string
}
//user favourites used in user struct
type Blacklists struct{
	Blname string
	Bllatitude string
	Bllongtitude string
}
//opens and returns connection to Mongodb
func getCollection() *mgo.Collection{

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

func returnAllPersons(){//return all records in collection
    collection := getCollection()

	// Retrieve the list of Persons - array object
	var person []Person
	err := collection.Find(nil).All(&person)
	if err != nil {
		log.Printf("RunQuery : ERROR : %s\n", err)
		return
	}

	for i:=0; i<len(person); i++{
		fmt.Println("Person:", person[i])
	}
    
    fmt.Println("List of all \n")

}//returnAllPersons

func returnInsertPerson(){//insert person into database
    collection := getCollection()

	//Person builder - will be replaced with http request
	name := "Rocky Flintstone"
	location := "Outer Mongolia"
	fbname := "didyoujustblink"
	fbpass := "tombola"
	email := "rockyflint@hotmail.com"
	latitude := 43.345665
	longitude := 54.23546
	favname := "KFC"
	favlat := "34.453453"
	favlong :="23.643563"
	myfavourites := []Favs {{Favname:favname, Favlatitude:favlat, Favlongtitude:favlong}}

	
	// Insert into db
	err := collection.Insert(&Person{Name: name, Location: location, Fbname: fbname, Fbpass: fbpass, Email: email, Latitude: latitude, Longtitude: longitude, Favourites: myfavourites})

	if err != nil {
		panic(err)
	}

	fmt.Println("Inserted to database")

}//returnInsertPerson

func returnFindPerson(i string){//find individual person
    collection := getCollection()
	result := Person{}
	//find user by name
	findName := i
	
	err := collection.Find(bson.M{"name": findName}).One(&result)
	if err != nil {
		panic(err)
	}
	//log to screen for testing - can be deleted
	fmt.Println("----------Person-----------")
	fmt.Println("Name:", result.Name)
	fmt.Println("Location:", result.Location)
	fmt.Println("Facebook Username:", result.Fbname)
	fmt.Println("Email:", result.Email)
	fmt.Println("Latitude:", result.Latitude)
	fmt.Println("Longtitude:", result.Longtitude)
	fmt.Println("Favourites:", result.Favourites)
	fmt.Println("Blacklist:", result.Blacklist)

	for i:=0; i<len(result.Favourites); i++{
		fmt.Println("Favourites:", result.Favourites[i].Favname)
	}

	fmt.Println("Find user by name")

}//returnFindPerson

func returnUpdatePerson(i string, e string){// Update user email based on searched name
    collection := getCollection()

	findName := i
	email := e

	colQuerier := bson.M{"name": findName} //find user
	change := bson.M{"$set": bson.M{"email": email}} //set new email value
	err := collection.Update(colQuerier, change)
	if err != nil {
		panic(err)
	}
    
    fmt.Println("Update \n")

}//returnUpdatePerson

func returnRemovePerson(i string){// Remove user
    collection := getCollection()
	
	rmvname := i
    // remove entry        
    err := collection.Remove(bson.M{"name": rmvname})
    if err != nil {
		panic(err)
	}
    
    fmt.Println("Remove \n")

}//returnRemovePerson

func returnSortByLocation(){// Sort collection by location
    collection := getCollection()
	
	var results []Person
	err := collection.Find(bson.M(nil)).Sort("location").All(&results)//find all users and sort results by location (or any attribute)

	if err != nil {
		panic(err)
	}

	for i:=0; i<len(results); i++{
		fmt.Println("Person:", results[i])
	}
	
	fmt.Println("Sort by location: ", results)

}//returnSortByLocation

// main is the entry point for the application.
// func main() {

// 	//uncomment to call functions

// 	//returnAllPersons()
// 	//returnInsertPerson()
// 	returnFindPerson("Sarah Figgs")
// 	//returnUpdatePerson("John Smith", "myemail@email.com")
// 	//returnRemovePerson("Rocky Flintstone")
// 	//returnAllPersons()
// 	//returnSortByLocation()

// }//main


