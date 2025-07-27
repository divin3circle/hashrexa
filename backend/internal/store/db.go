package store

import (
	"log"

	badger "github.com/dgraph-io/badger/v4"
)

  func Open(path string) (*badger.DB, error) {
	db, err := badger.Open(badger.DefaultOptions(path))
	if err != nil {
		log.Fatalf("Failed to open badger database: %v", err)
		return nil, err
	}
	log.Printf("Badger database opened successfully at %s", path)

	return db, nil
  }