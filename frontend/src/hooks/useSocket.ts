import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types";
import { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(roomId?: string) {
    const token = useAuthStore((s) => s.token);
    const addMessage = useChatStore((s) => s.addMessage );

    const socket: Socket | null = useMemo(() => {
        if(!token) return null;
        return io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            autoConnect: true,
        });
    }, [token]);

    useEffect(() => {
        if(!socket) return;
        
        const handleReceiveMessage = (data: { roomId: string; message: Message }) => {
            addMessage(data.roomId, data.message);
        };

        socket.on("receive-message", handleReceiveMessage);

        if(roomId) {
            socket.emit('join-room', roomId);
        }
        
        return () => {
            socket.off('receive-message', handleReceiveMessage);
            if(roomId) {
                socket.emit('leave-room', roomId);
            }
        };
    }, [socket, roomId]); // Removido addMessage das dependências

    const sendMessage = (payload: { roomId: string; message: Message }) => {
        socket?.emit('send-message', payload);
    };

    // Cleanup global quando o hook for desmontado
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return { socket, sendMessage };
}