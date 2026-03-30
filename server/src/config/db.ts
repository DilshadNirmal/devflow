import mongoose from "mongoose";

export default async function connectDb() {
  const mongodbUri = Bun.env.MONGODB_URI;
  try {
    if (mongodbUri) {
      await mongoose.connect(mongodbUri);
    } else {
      throw new Error("MONGODB_URI is not defined in .env");
    }
  } catch (error) {
    console.error("Error connecting to mongodb: ", error);
    throw error;
  }
}

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongodb :", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("disconnected from mongodb.");
});

mongoose.connection.on("reconnected", () => {
  console.log("reconnected to mongodb.");
});
