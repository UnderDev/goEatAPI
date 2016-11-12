package main

import (
	//"encoding/json"
	"fmt"

	fb "github.com/huandu/facebook"
)

func acccessKey(key string) string {
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

		var id string = res["id"].(string)
		var p Person = goFind(id)

		fmt.Println("passs :" + p.Fbpass + "name :" + p.Name + "photo :" + p.Photo)
		if p.Name == "" {
			//create account
			returnInsertPerson(res["id"].(string), res["name"].(string), url)
		}
		return id
	}
	return "nil"
}
