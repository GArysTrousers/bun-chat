import { ChatRoom } from "../lib/chat";
import { json } from "../lib/http";
import { chatRooms } from "../main";

export async function getRooms(req:Request) {
  let rooms = chatRooms.map((v)=>({
    name: v.name,
    clients: [...v.clients.values()].map((c) => c.name)
  }))

  return json(rooms)
}

export async function newRoom(req:Request) {
  let name = "" //TODO get name from request
  for (const room of chatRooms) {
    if (room.name === name) throw "Name Taken"
  }
  chatRooms.push(new ChatRoom(name))
  return json(name)
}