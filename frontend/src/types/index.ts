export type ID = string;

export type User = {
    id: ID;
    username: string;
    email: string;
    avatarUrl?: string;
    status?: 'online' | 'offline' | 'busy' | 'away' | 'invisible';
    createdAt: string | Date;
    updatedAt: string | Date;
}

export type Message = {
    id: ID;
    conversationId: ID;
    senderId: ID;
    content: string;
    createdAt: string | Date;
}

export type Conversation = {
    id: ID;
    title?: string;
    participants: User[];
    lastMessage?: Message;
    updatedAt: string | Date;
}