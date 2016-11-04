package main

import (
	"fmt"
	"net/http"

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
		/*resp, goErr := http.Get("https://goeatapi.herokuapp.com/returnFindPerson/" + id)
		if goErr == nil {
			fmt.Println(resp)
			if resp == nil {
				//create account
				fmt.Println("sallgood Undefined")
				//doFunction(res["name"], res["id"])
			}
		}*/
	}
	return "hello" //res["first_name"]
}
