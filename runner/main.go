package main

import (
	"context"
	"devflow/runner/db"
	"devflow/runner/models"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func startPolling(collection *mongo.Collection) {
	for {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		var run models.Run
		err := collection.FindOne(ctx, bson.D{{ Key: "status", Value: "pending"}}).Decode(&run)
		cancel()

		if err == mongo.ErrNoDocuments {
			log.Println("No pending runs found, waiting...")
		} else if err != nil {
			log.Println("Error querying runs:", err)
		} else {
			log.Println("Found pending runs: ", run.ID)
		}

		time.Sleep(5 * time.Second)
	}
}

func main() {
	client, err := db.ConnectDb(os.Getenv("MONGODB_URI"))
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("devflow").Collection("runs");
	startPolling(collection)
	
}