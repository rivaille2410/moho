import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getNotificationSocket(): Socket {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
    });
  }

  return socket;
}
