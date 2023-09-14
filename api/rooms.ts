import { json } from "../lib/http";
import { chatRooms } from "../main";

export async function getRooms() {
  let rooms = chatRooms.map((v)=>({
    name: v.name,
    clients: [...v.clients.values()].map((c) => c.name)
  }))

  return json(rooms)
}