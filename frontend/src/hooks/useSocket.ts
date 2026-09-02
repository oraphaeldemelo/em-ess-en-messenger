import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types";
import { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(roomId?: string) {

    const token = useAuthStore((state) => state.token);
    const addMessage = useChatStore((state) => state.addMessage );

    const socket: Socket | null = useMemo(() => {
        if(!token) return null;

        return io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
            autoConnect: false,
        });
    }, [token]);

    useEffect(() => {
        if (!socket) {
          return;
        }
      
        const handleConnect = () => {
          console.log(
            '[socket] connected:',
            socket.id,
          );
        };
      
        const handleConnectError = (error: Error & {
          data?: unknown;
        }) => {
          console.error(
            '[socket] connect_error:',
            error.message,
            error.data,
          );
        };
      
        socket.on('connect', handleConnect);
      
        socket.on('connect_error', handleConnectError);
      
        socket.connect();
      
        return () => {
          socket.off( 'connect', handleConnect);
      
          socket.off('connect_error', handleConnectError);
      
          socket.disconnect();
        };
      }, [socket]);

      useEffect(() => {
        if(!socket || !roomId) return

        const handleReceiveMessage = ( message: Message ) => {
            addMessage(roomId, message);
        }
    
        socket.on("receive-message", handleReceiveMessage);

        socket.emit("join-room", roomId);

        return () => {
            socket.off("receive-message", handleReceiveMessage)
            socket.emit("leave-room", roomId);
        }
      }, [socket, roomId, addMessage])

    const sendMessage = (payload: { roomId: string; message: Message }) => {
        socket?.emit('send-message', payload);
    };

    return { socket, sendMessage };
}