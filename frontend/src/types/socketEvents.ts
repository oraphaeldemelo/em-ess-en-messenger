export interface SocketMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

export interface JoinRoomPayload {
    roomId: string;
}

export interface LeaveRoomPayload {
    roomId: string;
}

export interface SendMessagePayload {
    roomId: string;
    message: SocketMessage;
}

export interface ClientToServerEvents {
    'join-room': (
        payload: JoinRoomPayload
    ) => void;

    'leave-room': (
        payload: LeaveRoomPayload
    ) => void;

    'send-message': (
        payload: SendMessagePayload
    ) => void;
}

export interface ServerToClientEvents {
    'receive-message': (
        message: SocketMessage,
    ) => void;
}