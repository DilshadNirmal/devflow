package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Step struct {
	Name  string `bson:"name"`
	Command string `bson:"command"`
}

type EnvVar struct {
	Key    string `bson:"key"`
	Value    string   `bson:"value"`
}

type Pipeline struct {
	ID	  bson.ObjectID `bson:"_id,omitempty"`
	Project    bson.ObjectID  `bson:"project"`
	DockerImage    string    `bson:"docker_image"`
	Steps    []Step   `bson:"steps"`
	EnvVar   []EnvVar   `bson:"envVar"`
	IsActive    bool    `bson:"is_active"`  
}