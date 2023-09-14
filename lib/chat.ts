import { ServerWebSocket } from "bun";

export class ChatRoom {

  name: string;
  clients = new Map<ServerWebSocket<unknown>, Client>()
  messages: string[] = []

  constructor(name: string) {
    this.name = name;
  }

  sendAll(message: string) {
    this.messages.push(message)
    for (const ws of this.clients.keys()) {
      ws.send(msg(
        MsgType.SendMessage,
        message
      ))
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

export enum MsgType {
  Error,
  SetName,
  SetNameConfirm,
  JoinRoom,
  JoinRoomConfirm,
  SendMessage,
  GetRoomMessages,
}

export interface Message {
  type: MsgType;
  data: string;
}

export function msg(type: MsgType, data: any = '') {
  return JSON.stringify({ type, data })
}