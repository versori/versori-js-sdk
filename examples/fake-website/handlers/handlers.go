package handlers

import (
	"fakeclientwebsite/render"
	"fakeclientwebsite/users"
	"net/http"
)

type Repository struct {
	rdr render.Renderer
}

var Repo *Repository

func NewHandlers() {
	Repo = &Repository{
		rdr: render.NewRenderer(),
	}
}

func (repo *Repository) Root(w http.ResponseWriter, r *http.Request) {
	repo.rdr.RenderTemplate(w, r, "base.html", nil)
}

func (repo *Repository) Home(w http.ResponseWriter, r *http.Request) {
	if err := repo.rdr.RenderTemplate(w, r, "home.html", &render.TemplateData{
		StringMap: map[string]string{
			"user": users.GetUserFromRequest(r),
		}}); err != nil {
		panic(err)
	}

}

func (repo *Repository) Login(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if !users.IsValidUser(username, password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	jwt, err := users.CreateAndSignJWT(username)
	if err != nil {
		http.Error(w, "Error creating JWT", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "versori-user-jwt",
		Value: jwt,
	})
	w.Header().Add("HX-Refresh", "true")

	w.WriteHeader(http.StatusOK)
}

func (repo *Repository) Signup(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if users.CheckUserExists(username) {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	jwt, err := users.CreateUser(username, password)
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "versori-user-jwt",
		Value: jwt,
	})

	w.Header().Add("HX-Refresh", "true")
	w.WriteHeader(http.StatusOK)
}
