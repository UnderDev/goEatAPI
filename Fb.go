package main

import (
	"fmt"

	fb "github.com/huandu/facebook"
)

func acccessKey(key string) string {
	res, err := fb.Get("/me", fb.Params{
		"fields":       "id,name,email",
		"access_token": key,
	})
	if err == nil {
		fmt.Println("here is my facebook first name:", res["name"])
		var id string = res["id"].(string)
		var p Person = goFind(id)
		fmt.Println("passs :" + p.Fbpass + "name :" + p.Name + "photo :" + p.Photo)
		if p.Name == "" {
			//create account
			returnInsertPerson(res["id"].(string), res["name"].(string))
		}
		return id
	}
	return "nil"
}
