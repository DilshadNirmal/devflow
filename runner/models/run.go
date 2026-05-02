package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Run struct {
	ID		bson.ObjectID   `bson:"_id,omitempty"`
	Project bson.ObjectID   `bson:"project"`
	Pipeline bson.ObjectID  `bson:"pipeline"`
	Status   string         `bson:"status"`
	Logs     []string       `bson:"logs"`
	StartedAt bson.DateTime   `bson:"started_at"`
	FinishedAt *bson.DateTime  `bson:"finished_at,omitempty"`
}