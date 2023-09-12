import { html, page, template } from "./lib/html";
import { Route, Router } from "./lib/router";

const router = new Router()

router.add(new Route('^/$',
  async (req) => html(
    template('basic', {
      body: await page(`./routes/home.html`),
      title: 'Chat'
    })
  )))

router.add(new Route('^/', async (req: Request) => {
  const url = new URL(req.url)
  return html(template('basic', {
    body: await page(`./routes${url.pathname}.html`),
    title: "Chat"
  }))
}))

Bun.serve({
  port: 3000,
  async fetch(req, server) {
    const success = server.upgrade(req);
    if (success) return undefined;

    const res = await router.resolve(req)

    return res;
  },
  websocket: {
    open(ws) {

    },
    close(ws, code, reason) {

    },
    message(ws, message) {
      console.log(`Received ${message}`);
      ws.send(`You said: ${message}`);
    },

  }
})

console.log('Bun server started');
