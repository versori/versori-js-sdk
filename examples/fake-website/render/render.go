package render

import (
	"bytes"
	"embed"
	"fmt"
	"net/http"
	"text/template"
)

//go:embed templates/*
var fs embed.FS

type TemplateData struct {
	StringMap map[string]string
	IntMap    map[string]int
	FloatMap  map[string]float32
	Data      map[string]any
}

type Renderer struct {
}

func NewRenderer() Renderer {
	return Renderer{}
}

// RenderTemplate renders a single template as a component to the response writer mainly for htmx elements.
func (rdr *Renderer) RenderTemplate(w http.ResponseWriter, r *http.Request, name string, data *TemplateData) error {
	buf := new(bytes.Buffer)

	nameGlob := fmt.Sprintf("templates/%s", name)

	tmpl, err := template.ParseFS(fs, nameGlob)
	if err != nil {
		return err
	}

	err = tmpl.Execute(buf, data)
	if err != nil {
		return err
	}

	_, err = buf.WriteTo(w)
	if err != nil {
		return err
	}

	return nil
}
