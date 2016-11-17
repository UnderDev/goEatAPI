package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	fb "github.com/huandu/facebook"
	"gopkg.in/macaron.v1"
)

type Id struct {
	Id string
}

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

		id := Id{res["id"].(string)}
		var p Person = goFind(id.Id)
		if p.Name == "" {
			//create account
			returnInsertPerson(res["id"].(string), res["name"].(string), url)
		}
		js, err := json.Marshal(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)

		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
	}
	return "nil"
}
