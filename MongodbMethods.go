// This program provides a sample application for using MongoDB with
// the mgo driver.
package main

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
    "fmt"
)

const (
	MongoDBHosts = "ds035846.mlab.com:35846"
	AuthDatabase = "heroku_7bd4bdpc"
	AuthUserName = "goteamadmin"
	AuthPassword = "goteam1"
	TestDatabase = "heroku_7bd4bdpc"
)

type Person struct {
        Name string `bson:"name" json:"name`
        Location string `bson:"location"`
        Fbname string `bson:"fbname"`
        Fbpass string `bson:"fbpass"`
        Email string `bson:"email"`
        Latitude float64 `bson:"latitude"`
        Longtitude float64 `bson:"longitude"`
		Favourites []Favs `bson:"favourites"`
		Blacklist []Blacklists `bson: "blacklist"`
  
}

type Favs struct{
	Favname string
	Favlatitude string
	Favlongtitude string
}

type Blacklists struct{
	Blname string
	Bllatitude string
	Bllongtitude string
}

// main is the entry point for the application.
func main() {
	// We need this object to establish a session to our MongoDB.
	mongoDBDialInfo := &mgo.DialInfo{
		Addrs:    []string{MongoDBHosts},
		Timeout:  60 * time.Second,
		Database: AuthDatabase,
		Username: AuthUserName,
		Password: AuthPassword,
	}

	// Create a session which maintains a pool of socket connections
	// to our MongoDB.
	mongoSession, err := mgo.DialWithInfo(mongoDBDialInfo)
	if err != nil {
		log.Fatalf("CreateSession: %s\n", err)
	}

	// Reads may not be entirely up-to-date, but they will always see the
	// history of changes moving forward, the data read will be consistent
	// across sequential queries in the same session, and modifications made
	// within the session will be observed in following queries (read-your-writes).
	// http://godoc.org/labix.org/v2/mgo#Session.SetMode
	mongoSession.SetMode(mgo.Monotonic, true)

	
	sessionCopy := mongoSession.Copy()
	defer sessionCopy.Close()

	// Get a collection to execute the query against.
	collection := sessionCopy.DB(TestDatabase).C("Users")

	// Retrieve the list of Persons - array object
	var person []Person
	err = collection.Find(nil).All(&person)
	if err != nil {
		log.Printf("RunQuery : ERROR : %s\n", err)
		return
	}

	for i:=0; i<len(person); i++{
		fmt.Println("Person:", person[i])
	}
    
    fmt.Println("List of all \n")


	//Person builder
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
	err = collection.Insert(&Person{Name: name, Location: location, Fbname: fbname, Fbpass: fbpass, Email: email, Latitude: latitude, Longtitude: longitude, Favourites: myfavourites})

	if err != nil {
		panic(err)
	}

	err = collection.Insert(&Person{Name: "Bobby O'Toole", Location: "Swinford", Fbname: "botty", Fbpass: "mypass", Email: "bot@email.com", Latitude: 32.43423, Longtitude: 45.42323, Favourites: []Favs{{Favname:"McDonalds", Favlatitude:"34.453453", Favlongtitude:"23.643563"}}})

	if err != nil {
		panic(err)
	}
    
    fmt.Println("Insert \n")

    
    
   // Retrieve the specific detail - object
	result := Person{}
	err = collection.Find(bson.M{"name": "John Smith"}).One(&result)
	if err != nil {
		panic(err)
	}

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

	//find user by name
	findName := "Rocky Flintstone"
	
	err = collection.Find(bson.M{"name": findName}).One(&result)
	if err != nil {
		panic(err)
	}

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
    
    // Update user email based on searched name
	colQuerier := bson.M{"name": "John Smith"}
	change := bson.M{"$set": bson.M{"email": "jjsmith@email.com"}}
	err = collection.Update(colQuerier, change)
	if err != nil {
		panic(err)
	}
    
    fmt.Println("Update \n")
    
	rmvname := "Rocky Flintstone"
    // remove entry        
    err = collection.Remove(bson.M{"name": rmvname})
    if err != nil {
		panic(err)
	}
    
    fmt.Println("Remove \n")

 
	// Query All and sort
	var results []Person
	err = collection.Find(bson.M(nil)).Sort("location").All(&results)

	if err != nil {
		panic(err)
	}

	for i:=0; i<len(results); i++{
		fmt.Println("Person:", results[i])
	}
	//fmt.Println("Results All: ", results)
    
 
}


