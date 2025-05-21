package users

import (
	"bytes"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	OrgID = "01GHV97YARFJPP2WC7BE9YHP03"
	SkID  = "01JTR0D0P5CBME0S1E0GQ7NPQX"
)

type User struct {
	ExternalID string `json:"external_id"`
	Password   string `json:"password,omitzero"`
}

var Users = []User{
	{
		ExternalID: "teo",
		Password:   "password",
	},
	{
		ExternalID: "Joe",
		Password:   "password",
	},
	{
		ExternalID: "Andy",
		Password:   "AndyPassword",
	},
	{
		ExternalID: "Sean",
		Password:   "SeanPassword",
	},
}

func IsValidUser(externalID, password string) bool {
	for _, user := range Users {
		if strings.ToLower(user.ExternalID) == strings.ToLower(externalID) && user.Password == password {
			return true
		}
	}

	return false
}

func CheckUserExists(externalID string) bool {
	for _, user := range Users {
		if strings.ToLower(user.ExternalID) == strings.ToLower(externalID) {
			return true
		}
	}

	return false
}

func CreateUser(externalID, password string) error {
	if CheckUserExists(externalID) {
		return errors.New("user already exists")
	}

	Users = append(Users, User{
		ExternalID: externalID,
		Password:   password,
	})

	// now need to create jwt and actually sign up the user to the platform.
	err := createVersoriUser(externalID)
	if err != nil {
		return err
	}

	return nil
}

func CreateAndSignJWT(externalID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodRS256,
		jwt.MapClaims{
			"sub": externalID,
			"iat": time.Now().Unix(),
			"iss": fmt.Sprintf("https://versori.com/sk/%s", SkID), // ID is signing key id
			"exp": time.Now().Add(time.Hour * 1).Unix(),
		})

	key, err := loadPrivateKey()
	if err != nil {
		fmt.Println("Error loading private key:", err)
		return "", err
	}

	// Sign the token using the private key
	tokenString, err := token.SignedString(key)
	if err != nil {
		fmt.Println("Error signing token:", err)
		return "", err
	}

	return tokenString, nil
}

func loadPrivateKey() (*rsa.PrivateKey, error) {
	// reads a PKCS8 private key from a file called private_key.pem
	// and returns it as a string

	keyBytes, err := os.ReadFile("private_key.pem")
	if err != nil {
		fmt.Println("Error reading private key file:", err)
		return nil, err
	}

	p, _ := pem.Decode(keyBytes)
	if p == nil {
		return nil, errors.New("failed to parse PEM block")
	}

	key, err := x509.ParsePKCS8PrivateKey(p.Bytes)
	if err != nil {
		return nil, err
	}

	k, ok := key.(*rsa.PrivateKey)
	if !ok {
		return nil, errors.New("key is not of type *rsa.PrivateKey")
	}

	return k, nil
}

func createVersoriUser(username string) error {
	jwt, err := CreateAndSignJWT(username)
	if err != nil {
		fmt.Println("Error creating JWT:", err)
		return err
	}

	data := map[string]string{
		"externalId":  username,
		"displayName": username,
	}

	body := new(bytes.Buffer)
	err = json.NewEncoder(body).Encode(data)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("https://platform.versori.com/api/v2/o/%s/users", OrgID), body)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "JWT "+jwt)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return err
	}

	resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		fmt.Println("Error creating user:", resp.Status)
		return fmt.Errorf("error creating user: %s", resp.Status)
	}

	return nil
}
