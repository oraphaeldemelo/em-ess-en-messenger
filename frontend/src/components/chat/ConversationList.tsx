import { Conversation } from "@/types";
import { useMemo, useState } from "react";

type ContactSection = {
    label: string;
    status: "online" | "away" | "busy" | "offline";
    conversations: Conversation[];
};

const statusOrder: ContactSection["status"][] = ["online", "busy", "away", "offline"];

const getConversationStatus = (conversation: Conversation): ContactSection["status"] => {
    const status = conversation.participants.find((participant) => participant.status && participant.status !== "invisible")?.status;
    if (status === "busy" || status === "away" || status === "offline") return status;
    return "online";
};

const sectionLabel: Record<ContactSection["status"], string> = {
    online: "Online",
    busy: "Busy",
    away: "Away",
    offline: "Offline",
};

const sectionDot: Record<ContactSection["status"], string> = {
    online: "wlm-dot-green",
    busy: "wlm-dot-red",
    away: "wlm-dot-yellow",
    offline: "wlm-dot-gray",
};

export default function ConversationList({
    conversations,
    userName,
    onSelectConversation,
}: {
    conversations: Conversation[];
    userName: string;
    onSelectConversation: (id: string) => void;
}) {
    const [query, setQuery] = useState("");
    const [collapsed, setCollapsed] = useState<Record<ContactSection["status"], boolean>>({
        online: false,
        busy: false,
        away: false,
        offline: false,
    });

    const filteredSections = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return statusOrder
            .map((status) => ({
                status,
                label: sectionLabel[status],
                conversations: conversations.filter((conversation) => {
                    const contactName = conversation.title || conversation.participants.map((p) => p.username).join(", ");
                    const matchesSearch = !normalized || contactName.toLowerCase().includes(normalized);
                    return getConversationStatus(conversation) === status && matchesSearch;
                }),
            }))
            .filter((section) => section.conversations.length > 0);
    }, [conversations, query]);

    const profileName = userName || conversations[0]?.participants[0]?.username || "Júlio";

    return (
        <div className="wlm-list-window">
            <header className="wlm-list-header">
                <div className="wlm-avatar-frame">
                    <div className="wlm-avatar" aria-hidden="true">
                        {profileName[0]?.toUpperCase() || "J"}
                    </div>
                </div>
                <div className="wlm-profile-copy">
                    <div className="wlm-profile-line">
                        <strong>{profileName}</strong>
                        <span className="wlm-status-pill">Disponível</span>
                        <span className="wlm-caret">▾</span>
                    </div>
                    <div className="wlm-message-line">
                        <span>Compartilhar uma mensagem rápida</span>
                        <span className="wlm-caret">▾</span>
                    </div>
                </div>
                <div className="wlm-notify">
                    <span className="wlm-mail">📩</span>
                    <span className="wlm-badge">6</span>
                </div>
            </header>

            <div className="wlm-search-row">
                <input
                    className="wlm-search"
                    placeholder="Pesquisar contatos na Web..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="wlm-search-btn" type="button">Pesquisar</button>
            </div>

            <div className="wlm-contacts">
                {filteredSections.map((section) => (
                    <section key={section.status} className="wlm-group">
                        <button
                            type="button"
                            className="wlm-group-header"
                            onClick={() => setCollapsed((current) => ({ ...current, [section.status]: !current[section.status] }))}
                        >
                            <span className={`wlm-group-toggle ${collapsed[section.status] ? "is-collapsed" : ""}`} />
                            <strong>{section.label} ({section.conversations.length})</strong>
                        </button>
                        <div className={`wlm-group-list ${collapsed[section.status] ? "is-collapsed" : ""}`}>
                            {section.conversations.map((conversation) => {
                                const participant = conversation.participants[0];
                                const title = conversation.title || conversation.participants.map((p) => p.username).join(", ");
                                const subtitle = conversation.lastMessage?.content || "";
                                return (
                                    <button
                                        key={conversation.id}
                                        type="button"
                                        className="wlm-contact"
                                        onClick={() => onSelectConversation(conversation.id)}
                                    >
                                        <span className={`wlm-contact-dot ${sectionDot[section.status]}`} />
                                        <span className="wlm-contact-avatar" aria-hidden="true">
                                            {(participant?.username || title)[0]?.toUpperCase()}
                                        </span>
                                        <span className="wlm-contact-copy">
                                            <span className="wlm-contact-name">{title}</span>
                                            {subtitle ? <span className="wlm-contact-message">{subtitle}</span> : null}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}
                {!filteredSections.length && <div className="wlm-empty">Nenhum contato encontrado.</div>}
            </div>
        </div>
    );
}
