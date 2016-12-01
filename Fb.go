package main

import (
	"net/http"

	fb "github.com/huandu/facebook"
	"gopkg.in/macaron.v1"
)

func acccessKey(w http.ResponseWriter, req *http.Request, ctx *macaron.Context) string {
	//take parameters from get request
	key := ctx.Params("id")
	//use key as the accesskey to access the user's personal information from facebook
	res, err := fb.Get("/me", fb.Params{
		"fields":       "id,name,email,picture",
		"access_token": key,
	})
	//if request was valid
	if err == nil {
		//parse json for the uri pointing to the user's profile picture
		picture := res["picture"].(map[string]interface{})
		data := picture["data"].(map[string]interface{})
		url := data["url"].(string)
		//get facebook id from response
		id := res["id"].(string)
		//check mongo for account already associated with id
		var p Person = goFind(id)
		//user account doesn't exist
		if p.Name == "" {
			//create account
			returnInsertPerson(res["id"].(string), res["name"].(string), url)
		}
		//return the user's facebook id
		return id
	}
	return "nil"
}
