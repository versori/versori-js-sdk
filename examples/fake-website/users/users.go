package users

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"os"
	"strings"
	"time"
)

type User struct {
	ExternalID string `json:"external_id"`
	Password   string `json:"password,omitzero"`
}

var Users = []User{
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

func CreateAndSignJWT(externalID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodRS256,
		jwt.MapClaims{
			"sub": externalID,
			"iat": time.Now().Unix(),
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
