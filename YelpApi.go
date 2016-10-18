package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

//-----------------------------NESTED STRUCT FOR NESTED JSON--------------------------------------------------------/

// Inner2 struct
type Inner2 struct {
	TOTAL float64 `json:"latitude"`
	ID    float64 `json:"longitude"`
}

// Inner struct
type Inner struct {
	Key Inner2 `json:"center"`
}

//Container struct
type Container struct {
	Key Inner `json:"region"`
}

//-----------------------------NESTED STRUCT FOR NESTED [] JSON--------------------------------------------------------/

//Result struct
type Result struct {
	Objects []struct {
		Name       string     `json:"name"`
		Categories [][]string `json:"categories"`
		Snippet    string     `json:"snippet_text"`
	} `json:"businesses"`
}

//timestamp := strconv.FormatInt(time.Now().UTC().UnixNano(), 10)

func main() {

	//GET THE REQUEST
	var request = getReq()
	res, err := http.DefaultClient.Do(request)

	defer res.Body.Close()
	if err != nil {
		panic(err)
	}

	//READ IN ALL THE JSON INTO Body
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	//PRINT RESPONSE AND BODY
	fmt.Println(res)
	fmt.Println("\n" + string(body) + "\n\n\n")

	//UNMARSHAL RESULTS INTO MEMORY ADDRESS OF CONT
	var cont Result
	if err := json.Unmarshal([]byte(body), &cont); err != nil {
		log.Fatal(err)
	}

	//PRINT OUT ALL THE OBJECTS
	fmt.Printf("\n\n\n%+v\n", cont)

}

func getReq() *http.Request {

	custKey := "8xlVb9PCVJgnDzZswggJkg"
	custSecrete := "7NkJqxyxSCoNBK4dg2hKhz4w8k8"
	token := "hITxPexZBusfhCnWrIZwPkBvEkGOLXUG"
	tokenSecrete := "re09nlb0ZIr6ZRoROwngwM4eCYI"
	urllink := "https://api.yelp.com/v2/search/?"
	clientID := "UJjKiEWRvmJ4hW9uG4gsUg"
	clientSecrete := "iL3GpXR8ObyTYoNyX1bL5Va0oL36vVxhMmMCFe9jPqtwTjibjUJ9YGkXbveWjHBt"
	oauthVersion := "1.0"

	//GENERATES A NONCE
	nonceBytes := make([]byte, 4)
	rand.Read(nonceBytes)
	nonce := base64.StdEncoding.EncodeToString(nonceBytes)

	//GENERATE A TIMESTAMP(NOW)
	timestamp := strconv.FormatInt(time.Now().UTC().UnixNano(), 10)
	fmt.Println(timestamp)

	/*
		MESSAGE = url, params, consumerSecret, tokenSecret
	*/
	message := "GET/" + urllink +
		"client_id=" + clientID +
		"&client_secret=" + clientSecrete +
		"&limit=1" +
		"&location=Dnewyork" +
		"&oauth_consumer_key=" + custKey +
		"&oauth_nonce=" + nonce +
		"&oauth_signature_method=HMAC-SHA1" +
		"&oauth_timestamp=" + timestamp +
		"&oauth_token=" + token +
		"&oauth_version=" + oauthVersion +
		"&sort=1&" + custSecrete + "&" + tokenSecrete

	//GENERATE THE HMAC sha1
	signingKey := []byte(strings.Join([]string{custSecrete, tokenSecrete}, "%26"))
	sig := hmac.New(sha256.New, signingKey)

	sig.Write([]byte(message))
	signatureBytes := sig.Sum(nil)
	key := base64.StdEncoding.EncodeToString(signatureBytes)
	fmt.Println(hex.EncodeToString(sig.Sum(nil)))

	//GENERATE THE HMAC sha1
	/*signingKey := strings.Join([]string{custSecrete, tokenSecrete}, "%26")
	mac := hmac.New(sha1.New, []byte(signingKey))

	mac.Write([]byte(message))
	signatureBytes := mac.Sum(nil)
	key := base64.StdEncoding.EncodeToString(signatureBytes)*/
	//fmt.Println("Signing key " + signingKey + "\n\n")
	fmt.Println("Signing key " + message + "\n\n")
	/*

	 */

	//HARD-CODDED URL/PAYLOAD
	url := "https://api.yelp.com/v2/search/?client_id=UJjKiEWRvmJ4hW9uG4gsUg&client_secret=iL3GpXR8ObyTYoNyX1bL5Va0oL36vVxhMmMCFe9jPqtwTjibjUJ9YGkXbveWjHBt&oauth_consumer_key=8xlVb9PCVJgnDzZswggJkg&oauth_token=hITxPexZBusfhCnWrIZwPkBvEkGOLXUG&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1476137210&oauth_nonce=HCvr65&oauth_version=1.0&oauth_signature=ZGgMH3NGjv70c1ksOiQuiTRDLBg%3D&location=newyork&sort=1&limit=1"

	payload := strings.NewReader("client_id=UJjKiEWRvmJ4hW9uG4gsUg&client_secret=iL3GpXR8ObyTYoNyX1bL5Va0oL36vVxhMmMCFe9jPqtwTjibjUJ9YGkXbveWjHBt&" +
		"oauth_consumer_key=8xlVb9PCVJgnDzZswggJkg&oauth_token=hITxPexZBusfhCnWrIZwPkBvEkGOLXUG&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1476093856&oauth_nonce=kqKSy1&" +
		"oauth_version=2.0&oauth_signature=xLIIOpuULRnyF46GKBHenXaNL2M%3D")

	req, _ := http.NewRequest("GET", url, payload)
	req.Header.Add("content-type", "application/x-www-form-urlencoded")
	req.Header.Add("cache-control", "no-cache")

	//TIMESTAMP , NONCE , KEY   NOT WORKING CORECTLY
	req.Header.Add("authorization",
		"OAuth oauth_consumer_key=\"8xlVb9PCVJgnDzZswggJkg\","+
			"oauth_token=\"hITxPexZBusfhCnWrIZwPkBvEkGOLXUG\","+
			"oauth_signature_method=\"HMAC-SHA1\","+
			"oauth_version=\"1.0\","+
			/*

			 */
			"oauth_timestamp=\""+timestamp+"\","+
			"oauth_nonce=\""+nonce+"\","+
			"oauth_signature=\""+key+"\"")

	return req
}
