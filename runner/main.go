package main

import (
	"context"
	"devflow/runner/db"
	"devflow/runner/executor"
	"devflow/runner/models"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func startPolling(database *mongo.Database) {
	for {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		var run models.Run
		err := database.Collection("runs").FindOne(ctx, bson.D{{ Key: "status", Value: "pending"}}).Decode(&run)
		cancel()

		if err == mongo.ErrNoDocuments {
			log.Println("No pending runs found, waiting...")
		} else if err != nil {
			log.Println("Error querying runs:", err)
		} else {
			log.Println("Found pending runs: ", run.ID)

			ctx2, cancel2 := context.WithTimeout(context.Background(), 10*time.Second)
			var pipeline models.Pipeline
			err = database.Collection("pipelines").FindOne(ctx2, bson.D{{ Key: "_id", Value: run.Pipeline}}).Decode(&pipeline)
			cancel2()

			if err != nil {
				log.Println("Error fetching pipeline:", err)
			} else {
				err = executor.Execute(pipeline, run)
				if err != nil {
					log.Println("Error executing pipeline:", err)

					// update status to failed here
					ctx3, cancel3 := context.WithTimeout(context.Background(), 10*time.Second)
					_, err = database.Collection("runs").UpdateOne(ctx3,
					bson.D{{ Key: "_id", Value: run.ID}},
					bson.D{{ Key: "$set", Value: bson.D{{Key: "status", Value: "failed"}}}}
					)
					cancel3()
				} else {
					log.Println("Pipeline executed successfully:", run.ID)
					// update status to completed here
					ctx3, cancel3 := context.WithTimeout(context.Background(), 10*time.Second)
					_, err = database.Collection("runs").UpdateOne(ctx3,
					bson.D{{ Key: "_id", Value: run.ID}},
					bson.D{{ Key: "$set", Value: bson.D{{Key: "status", Value: "completed"}}}}
					)
					cancel3()
				}
			}
		}

		time.Sleep(5 * time.Second)
	}
}

func main() {
	client, err := db.ConnectDb(os.Getenv("MONGODB_URI"))
	if err != nil {
		log.Fatal(err)
	}

	database := client.Database("devflow")
	startPolling(database)
	
}