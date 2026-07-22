import { Conversation, Message } from "@/types";
import { create } from "zustand";

type ChatState = {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Record<string, Message[]>;
    setConversations: (c: Conversation[]) => void;
    setActiveConversation: (id: string | null) => void;
    addMessage: (convId: string, msg: Message) => void;
    setMessages: (convId: string, messages: Message[]) => void;
};

export const useChatStore = create<ChatState>((set) => ({ // explicar melhor o que essa função faz
    conversations: [],
    activeConversationId: null,
    messages: {},

    setConversations: (conversations) => set({ conversations }),
    setActiveConversation: (id) => set({ activeConversationId: id }),
    setMessages: (convId, messages) => set((s) => ({
        messages: { ...s.messages, [convId]: messages.length > 0 ? messages : []},
    })),
    addMessage: (convId, msg) => set((s) => {
        const existingMessages = s.messages[convId] || [];
        // Verifica se a mensagem já existe para evitar duplicatas
        const messageExists = existingMessages.some(m => m.id === msg.id);
        if (messageExists) {
            return s; // Não atualiza o estado se a mensagem já existe
        }
        return {
            messages: { ...s.messages, [convId]: [...existingMessages, msg]}
        };
    })
}))
