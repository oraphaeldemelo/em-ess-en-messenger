import { useState } from "react";


export default function MessageInput({ onSend }: { onSend: (content: string) => void}) {
    const [text, setText] = useState('');
    const send = () => {
        if(!text.trim()) return;
        onSend(text.trim());
        setText('');
    }

    return (
        <div className="msn-input-bar">
            <input 
                className="msn-input"
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Digite uma mensagem..." 
                onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button className="msn-button msn-button-primary" onClick={send}>Enviar</button>
        </div>
    );
}
