import { html, template } from "./lib/html";
import { Router } from "./lib/router";

const router = new Router()

router.add('/', (req) => html(
  template('basic',
    {
      body: "Hello",
      title: 'Chat'
    }
  )
))

Bun.serve({
  port: 3000,
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) return undefined;

    const res = router.resolve(req)

    return res;
  },
  websocket: {
    open(ws) {

    },
    close(ws, code, reason) {

    },
    message(ws, message) {
      console.log(`Received ${message}`);
      // send back a message
      ws.send(`You said: ${message}`);
    },

  }
})

console.log('Bun server started');
