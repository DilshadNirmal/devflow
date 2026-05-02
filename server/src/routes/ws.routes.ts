import { Hono } from "hono";
import { upgradeWebSocket, websocket } from "hono/bun";
import type { WSContext } from "hono/ws";

const ws = new Hono();
const clients = new Map<string, WSContext>();

ws.get(
  "/runs/:id",
  upgradeWebSocket((c) => {
    const id = c.req.param("id") ?? "";

    return {
      onOpen(_, ws) {
        console.log(`WebSocket opened for run ${id}`);
        clients.set(id, ws);
      },
      onMessage(event, ws) {
        ws.send(event.data.toString());
      },
      onClose() {
        clients.delete(id);
        console.log(`WebSocket closed for run ${id}`);
      },
    };
  }),
);

export { websocket, clients };
export default ws;
