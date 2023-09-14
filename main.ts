import { ServerWebSocket } from "bun";
import { ChatRoom, Client } from "./lib/chat";
import { asset, html, loadTemplates, page, template } from "./lib/http";
import { Route, Router } from "./lib/router";
import { getRooms } from "./api/rooms";

await loadTemplates('./templates');

const router = new Router()
export const chatRooms: ChatRoom[] = [
  new ChatRoom("Global")
]
export const clients = new Map<ServerWebSocket<unknown>, Client>()

router.add(new Route('^/$', async (req) => {
  return html(
    template('basic', {
      body: await page(`./routes/home.html`),
      title: 'Chat'
    }))
}))

router.add(new Route('^/assets/', async (req: Request) => {
  const url = new URL(req.url)
  return await asset(`.${url.pathname}`)
}))

router.add(new Route('^/api/get_rooms', getRooms))

router.add(new Route('^/room/', async (req) => {
  const url = new URL(req.url)
  let room = url.pathname.match('^/room/(.+)')
  if (!room) return new Response(null, { status: 404 })

  return html(
    template('basic', {
      title: 'Chat',
      body: template('chatroom', {
        room: room[1]
      })
    }))
}))

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
      clients.set(ws, new Client("Pending", ws))
    },
    close(ws, code, reason) {
      let client = clients.get(ws)
      if (client && client.room != null) {
        client.room.clients.delete(ws)
      }
      clients.delete(ws)
    },
    message(ws, rawMessage) {
      try {
        console.log(rawMessage);
        
        let client = clients.get(ws)
        if (!client) throw "Client not found"

        rawMessage = rawMessage.toString()
        let message = JSON.parse(rawMessage) as Message

        if (message.type === MsgType.SetName) {
          client.name = message.data
          ws.send(msg(MsgType.SetNameConfirm))
        }
        else if (message.type === MsgType.JoinRoom) {
          let room = chatRooms.find((v) => v.name === message.data)
          if (!room) throw "Room not found"
          client.room = room;
          room.clients.set(ws, client);
          ws.send(msg(MsgType.JoinRoomConfirm))
        }
        else if (message.type === MsgType.SendMessage) {
          if (!client.room) throw "Client not in room"
          client.room.sendAll(rawMessage)
        }
        else if (message.type === MsgType.GetRoomMessages) {

        }
      } catch (error) {
        console.log(error);
        ws.send(msg(MsgType.Error, error))
      }
    },

  }
})

enum MsgType {
  Error,
  SetName,
  SetNameConfirm,
  JoinRoom,
  JoinRoomConfirm,
  SendMessage,
  GetRoomMessages,
}

interface Message {
  type: MsgType;
  data: string;
}

function msg(type: MsgType, data: any = '') {
  return JSON.stringify({ type, data })
}

console.log('Bun server started');
