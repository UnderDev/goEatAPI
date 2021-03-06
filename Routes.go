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

	m.Get("/direction/:directions", getDirections)

	m.Get("/hello", func() string {
		return "Hello! Yes I still work."
	})

	m.Get("/accessKey/:id", acccessKey)
	//mongo methods
	//m.Get("/returnAllPersons", returnAllPersons)
	m.Get("/returnFindPerson/:fbpass", returnFindPerson)
	m.Get("/returnUpdateFavourites/:fbpass/:id/:name/:photo/:latitude/:longtitude", returnUpdateFavourites)
	m.Get("/returnUpdateBlacklist/:fbpass/:id/:name/:photo/:latitude/:longtitude", returnUpdateBlacklist)
	m.Get("/returnUpdateHistory/:fbpass/:id/:name/:photo/:latitude/:longtitude", returnUpdateHistory)
	m.Get("/returnRemoveFav/:fbpass/:fav", returnRemoveFav)
	m.Get("/returnRemoveBlist/:fbpass/:blist", returnRemoveBlist)
	m.Get("/returnRemoveHistory/:fbpass", returnRemoveHistory)
}
