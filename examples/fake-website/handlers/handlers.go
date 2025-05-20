package handlers

import (
	"fakeclientwebsite/render"
	"fakeclientwebsite/users"
	"net/http"
	"strings"
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
			"user": GetUser(r),
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

	http.SetCookie(w, &http.Cookie{
		Name:  "user",
		Value: strings.ToLower(username),
	})
	w.Header().Add("HX-Refresh", "true")

	w.WriteHeader(http.StatusOK)
}

func GetUser(r *http.Request) string {
	cookie, err := r.Cookie("user")
	if err != nil {
		return ""
	}
	return cookie.Value
}
