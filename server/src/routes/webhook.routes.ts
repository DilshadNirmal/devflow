import { Hono } from "hono";

const webhook = new Hono();

webhook.post("/", (c) => {
  return c.json({ message: "receive a github push event" });
});

export default webhook;
