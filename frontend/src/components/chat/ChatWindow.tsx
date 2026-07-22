import { useSocket } from "@/hooks/useSocket";
import { chatService } from "@/services/chatService";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useCallback, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message } from "@/types";

const EMPTY_MESSAGES: Message[] = [];

export default function ChatWindow({
    conversationId,
    conversationTitle,
    contactName,
    contactAvatarUrl,
    onClose,
}: {
    conversationId: string;
    conversationTitle: string;
    contactName: string;
    contactAvatarUrl?: string;
    onClose: () => void;
}) {
    const messagesFromStore = useChatStore((s) => s.messages[conversationId]);
    const messages = messagesFromStore || EMPTY_MESSAGES;
    const currentUser = useAuthStore((s) => s.user);

    const addMessage = useChatStore((s) => s.addMessage);
    const setMessages = useChatStore((s) => s.setMessages);
    const { sendMessage } = useSocket(conversationId);


    useEffect(() => {

        // Só carrega mensagens se ainda não existem para esta conversa
        if (messages.length > 0) return;
        
        const loadMessages = async () => {
            try {
                const messageList = await chatService.listMessages(conversationId);
               setMessages(conversationId, messageList);
                
            } catch (error) {
                console.error(error);
            }
        };
        
        loadMessages();
    }, [conversationId])

    const handleSend = useCallback((content: string) => {
        // Opcional: enviar para a API para persistir no banco
        // const saved = await chatService.sendMessage(conversationId, content);

        const saved = { id: crypto.randomUUID(), conversationId, senderId: 'me', content, createdAt: new Date()};
        addMessage(conversationId, saved);
        sendMessage({ roomId: conversationId, message: saved});
    }, [addMessage, conversationId, sendMessage])

    return (
        <div className="wlm-chat-overlay" onClick={onClose} role="presentation">
            <section className="wlm-chat-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <header className="wlm-chat-titlebar">
                    <div className="wlm-chat-title">
                        <span className="wlm-chat-title-name">{conversationTitle}</span>
                    </div>
                    <button type="button" className="wlm-chat-close" onClick={onClose} aria-label="Fechar chat">
                        ×
                    </button>
                </header>

                <div className="wlm-chat-stage">
                    <div className="wlm-chat-avatars-panel">
                        <div className="wlm-chat-avatar-slot wlm-chat-avatar-slot-top">
                            <div className="wlm-chat-contact-avatar-frame">
                                {contactAvatarUrl ? (
                                    <img className="wlm-chat-contact-avatar-img" src={contactAvatarUrl} alt={contactName} />
                                ) : (
                                    <div className="wlm-chat-contact-avatar-fallback">{contactName[0]?.toUpperCase() || "C"}</div>
                                )}
                            </div>
                            <div className="wlm-chat-contact-name wlm-chat-contact-name-inline">{" "}</div>
                        </div>
                        <div className="wlm-chat-avatar-slot wlm-chat-avatar-slot-bottom">
                            <div className="wlm-chat-contact-avatar-frame is-sender">
                                {currentUser?.avatarUrl ? (
                                    <img
                                        className="wlm-chat-contact-avatar-img"
                                        src={currentUser.avatarUrl}
                                        alt={currentUser.username || "Você"}
                                    />
                                ) : (
                                    <div className="wlm-chat-contact-avatar-fallback">{currentUser?.username?.[0]?.toUpperCase() || "V"}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="wlm-chat-content-panel">
                        <div className="wlm-chat-destination-name">{contactName}</div>
                        <div className="wlm-chat-destination-subtitle">Did anyone see movie last night?!</div>
                        <MessageList
                            messages={messages}
                            contactName={contactName}
                            currentUserName={currentUser?.username || "Você"}
                        />
                    </div>
                </div>

                <MessageInput onSend={handleSend} />
            </section>
        </div>
    )
}
