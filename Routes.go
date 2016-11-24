package main

import "gopkg.in/macaron.v1"

func initRoutes(m *macaron.Macaron) {

	//This is the example of how to build route groups

	// m.Group("/books", func() {
	//     m.Get("/:id", GetBooks)                  //goeatapi.herokuapp.com/books/1234
	//     m.Post("/new", NewBook)                  //goeatapi.herokuapp.com/books/new/1234
	//     m.Put("/update/:id", UpdateBook)         //goeatapi.herokuapp.com/books/update/1234
	//     m.Delete("/delete/:id", DeleteBook)      //goeatapi.herokuapp.com/books/delete/1234

	//     m.Group("/chapters", func() {
	//         m.Get("/:id", GetBooks)              //goeatapi.herokuapp.com/books/chapters/1234
	//         m.Post("/new", NewBook)              //goeatapi.herokuapp.com/books/chapters/new/1234
	//         m.Put("/update/:id", UpdateBook)     //goeatapi.herokuapp.com/books/chapters/update/1234
	//         m.Delete("/delete/:id", DeleteBook)  //goeatapi.herokuapp.com/books/chapters/delete/1234
	//     })
	// })

	m.Group("/maps", func() {
		m.Group("/nearby", func() {
			m.Get("/restaurants/:pos", restaurants)
			m.Get("/delivery/:pos", delivery)
			m.Get("/takeaway/:pos", takeaway)
		})
	})

	m.Get("/direction/:stuff", getDirections)

	m.Get("/hello", func() string {
		return "Hello! Yes I still work."
	})

	m.Get("/accessKey/:id", func(ctx *macaron.Context) string {
		return acccessKey(ctx.Params(":id"))
		//return "accessKey :" + ctx.Params(":id")
	})

	m.Get("/returnAllPersons", returnAllPersons)

	m.Get("/returnFindPerson/:id", returnFindPerson)

	m.Get("/returnUpdateFavourites/:id/:name/:photo/:latitude/:longtitude", returnUpdateFavourites)

	m.Get("/returnUpdateBlacklist/:id/:name/:photo/:latitude/:longtitude", returnUpdateBlacklist)
}
