package main

import (
	"fmt"

	fb "github.com/huandu/facebook"
)

type Foo struct {
	Bar string
}

func acccessKey(key string) string {
	res, err := fb.Get("/me", fb.Params{
		"fields":       "id,name,email",
		"access_token": key,
	})
	fmt.Println("here is my facebook first name:", res["name"])

	if err != nil {
		fmt.Println("Break")
	}
	return "hello" //res["first_name"]
}
