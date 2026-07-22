import { Conversation, Message } from "@/types";
import { api } from "./api";


export const chatService = {
    listConversations: async () => {
        const { data } = await api.get<Conversation[]>('/chats');
        return data;
    },
    listMessages: async (conversationId: string) => {
        const { data } = await api.get<Message[]>(`/chats/${conversationId}/messages`);
        return data;
    },
    sendMessage: async (conversationId: string, content: string) => {
        const { data } = await api.post<Message>(`/chats/${conversationId}/messages`, { content });
        return data;
    }
}