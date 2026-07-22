import ChatWindow from "@/components/chat/ChatWindow";
import ConversationList from "@/components/chat/ConversationList";
import { chatService } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";


export default function ChatsPage() {
    const { conversations, setConversations, activeConversationId, setActiveConversation } = useChatStore();
    const { user } = useAuth();
    const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || null;

    useEffect(() => {
        const loadConversations = async () => {
            try {
                
                const conversations = await chatService.listConversations();
                setConversations(conversations);
            } catch (error) {
                console.error('Erro ao carregar conversas:', error);
                // Você pode adicionar uma notificação de erro aqui
                setConversations([]); // Garante que o estado seja limpo em caso de erro
            }
        };
        
        loadConversations();
    }, []);

    return (
        <div className="msn-app msn-live-page">
            <div className="msn-live-window">
                <header className="msn-live-titlebar">
                    <div className="msn-live-brand">
                        <span className="msn-live-logo">msn</span>
                        <span>Messenger</span>
                    </div>
                    <div className="msn-live-window-controls" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </div>
                </header>
                <ConversationList
                    conversations={conversations}
                    userName={user?.username || "Júlio"}
                    onSelectConversation={setActiveConversation}
                />
                {activeConversationId && activeConversation ? (
                    <ChatWindow
                        conversationId={activeConversationId}
                        conversationTitle={activeConversation.title || activeConversation.participants.map((p) => p.username).join(", ")}
                        contactName={activeConversation.participants.map((p) => p.username).join(", ")}
                        contactAvatarUrl={activeConversation.participants[0]?.avatarUrl}
                        onClose={() => setActiveConversation(null)}
                    />
                ) : null}
            </div>
        </div>
    )
}
