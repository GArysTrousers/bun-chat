import { ServerWebSocket } from "bun";

export class ChatRoom {

  name: string;
  clients = new Map<ServerWebSocket<unknown>, Client>()

  constructor(name: string) {
    this.name = name;
  }

  sendAll(message:string) {
    for (const ws of this.clients.keys()) {
      ws.send(message)
    }
  }
}

export class Client {

  name: string;
  socket: ServerWebSocket<unknown>;
  room: ChatRoom | null = null

  constructor(name: string, ws: ServerWebSocket<unknown>) {
    this.name = name;
    this.socket = ws;
  }
}