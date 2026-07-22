import { Message } from "@/types";
import { formatDate } from "@/utils/formatDate";

export default function MessageList({
    messages,
    currentUserName,
    contactName,
}: {
    messages: Message[];
    currentUserName: string;
    contactName: string;
}) {
    return (
        <div className="wlm-message-shell msn-scroll">
            {messages.map((message) => {
                const isMe = message.senderId === "me";
                const senderName = isMe ? currentUserName : contactName;

                return (
                    <div key={message.id} className={`wlm-message-line-item ${isMe ? "is-me" : "is-contact"}`}>
                        <div className="wlm-message-name">{senderName}</div>
                        <div className="wlm-message-text">{message.content}</div>
                        <div className="wlm-message-time">{formatDate(message.createdAt)}</div>
                    </div>
                );
            })}
        </div>
    );
}
