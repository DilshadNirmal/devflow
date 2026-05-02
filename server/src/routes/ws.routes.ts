import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";

const ws = new Hono();

ws.get(
  "/runs/:id",
  upgradeWebSocket((c) => {
    const id = c.req.param("id");

    return {
      onOpen() {
        console.log(`WebSocket opened for run ${id}`);
      },
      onMessage(event, ws) {
        ws.send(event.data.toString());
      },
      onClose() {
        console.log(`WebSocket closed for run ${id}`);
      },
    };
  }),
);

export { websocket };
export default ws;
