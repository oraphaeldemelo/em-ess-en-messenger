import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(null);

        try {
            const { user, token } = await authService.register(username, email, password);
            setAuth(user, token);
            navigate('/');
        } catch (error: any) {
            setError(error?.response?.data?.error || 'Falha no cadastro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="msn-app msn-auth-page">
            <main className="msn-auth-shell">
                <section className="msn-auth-hero msn-panel">
                    <div className="msn-auth-badge">Mensagem instantânea</div>
                    <h1>Crie sua conta</h1>
                    <p>
                        Entre no Messenger moderno com uma base visual clássica e um fluxo rápido de cadastro.
                    </p>
                </section>
                <div className="msn-panel msn-auth-card">
                    <h2>Cadastrar</h2>
                    <p className="msn-conv-sub">Preencha seus dados para começar.</p>

                    <form onSubmit={onSubmit} className="msn-form">
                        <input 
                            className="msn-input"
                            placeholder="Usuário" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <input 
                            className="msn-input"
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <input 
                            className="msn-input"
                            placeholder="Senha" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <button className="msn-button msn-button-primary" disabled={loading} type="submit">
                            {loading ? 'Criando...' : 'Cadastrar'}
                        </button>
                    </form>

                    {error && <p className="msn-form-error">{error}</p>}

                    <p className="msn-auth-footer">
                        Já tem conta? <Link to="/login">Entrar</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
