package api

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)


type UserHandler struct {

}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (u *UserHandler) HandleRegisterUser(w http.ResponseWriter, r *http.Request) {
	// get user account id and topic id from params
	userAccountId := chi.URLParam(r, "userAccountId")
	topicId := chi.URLParam(r, "topicId")

	if userAccountId == "" || topicId == "" {
		http.Error(w, "Missing user account ID or topic ID", http.StatusBadRequest)
		return
	}

	// TODO: Implement user registration logic
	fmt.Fprintf(w, "User registered: Account ID=%s, Topic ID=%s\n", userAccountId, topicId)
}