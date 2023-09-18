import { ChatRoom } from "../lib/chat";
import { json } from "../lib/http";
import { chatRooms } from "../main";

export async function getRooms(req: Request) {
  let rooms = chatRooms.map((v) => ({
    name: v.name,
    clients: [...v.clients.values()].map((c) => c.name)
  }))

  return json(rooms)
}

export async function newRoom(req: Request) {
  let url = new URL(req.url)
  let name = url.searchParams.get('name')
  if (!name) return new Response(null, { status: 400 })
  for (const room of chatRooms) {
    if (room.name === name) return new Response(null, { status: 400 })
  }
  chatRooms.push(new ChatRoom(name))
  return json(name)

}