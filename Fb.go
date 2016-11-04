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
		id := res["id"]
		resp, goErr := http.Get("https://goeatapi.herokuapp.com/returnFindPerson/" + id)
		
		if(goErr==nil)
		{
			if resp==undefined
			{
				//create account
				
				//doFunction(res["name"], res["id"])
			}
		}
	}
	return "hello" //res["first_name"]
}
