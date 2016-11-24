package main

import (
	"fmt"
	"net/http"

	fb "github.com/huandu/facebook"
	"gopkg.in/macaron.v1"
)

func acccessKey(w http.ResponseWriter, req *http.Request, ctx *macaron.Context) string {
	key := ctx.Params("id")
	res, err := fb.Get("/me", fb.Params{
		"fields":       "id,name,email,picture",
		"access_token": key,
	})
	if err == nil {

		picture := res["picture"].(map[string]interface{})
		fmt.Println("We gud")
		data := picture["data"].(map[string]interface{})
		url := data["url"].(string)
		fmt.Println(url)
		if err != nil {
			fmt.Println("An error has happened %v", err)
			return ""
		}

		id := res["id"].(string)
		var p Person = goFind(id)
		if p.Name == "" {
			//create account
			returnInsertPerson(res["id"].(string), res["name"].(string), url)
		}
		return id
	}
	return "nil"
}
