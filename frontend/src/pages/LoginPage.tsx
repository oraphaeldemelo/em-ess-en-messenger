import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(null);

        try {
            const { user, token } = await authService.login(email, password);
            setAuth(user, token);
            navigate('/');
        } catch (error: any) {
            setError(error?.response?.data?.error || 'Falha no login'); 
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="msn-app msn-auth-page msn-login-window">
            <main className="msn-panel msn-login-shell">
                <div className="msn-login-titlebar">
                    <div className="msn-login-titlebar-label">Windows Live Messenger</div>
                    <div className="msn-login-titlebar-controls" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>

                <div className="msn-login-body">
                    <div className="msn-login-heading">
                        <div className="msn-login-kicker">Entrar no</div>
                        <h1>Windows Live <strong>Messenger</strong></h1>
                    </div>

                    <div className="msn-login-content">
                        <div className="msn-login-avatar" aria-hidden="true">
                            <div className="msn-login-avatar-frame">
                                <div className="msn-login-avatar-person">
                                    <span className="msn-login-avatar-head" />
                                    <span className="msn-login-avatar-body" />
                                </div>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="msn-login-form">
                            <input 
                                className="msn-input msn-login-input"
                                placeholder="exemplo555@hotmail.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                autoComplete="email"
                            />
                            <input 
                                className="msn-input msn-login-input"
                                placeholder="Senha" 
                                type="password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                autoComplete="current-password"
                            />

                            <a className="msn-login-link" href="#forgot">
                                Esqueceu sua senha?
                            </a>

                            <div className="msn-login-status">
                                <span>Entrar como:</span>
                                <span className="msn-login-status-pill">
                                    <i />
                                    Disponível
                                    <span className="msn-login-status-arrow">▾</span>
                                </span>
                            </div>

                            <label className="msn-login-check">
                                <input type="checkbox" />
                                <span>Lembrar minhas ID e senha</span>
                            </label>

                            <label className="msn-login-check msn-login-check-muted">
                                <input type="checkbox" disabled />
                                <span>Entrar automaticamente</span>
                                <a href="#options">Opções</a>
                            </label>

                            {error && <p className="msn-form-error">{error}</p>}

                            <div className="msn-login-actions">
                                <button className="msn-button msn-button-primary msn-login-submit" disabled={loading} type="submit">
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </button>
                                <button
                                    className="msn-button msn-button-secondary msn-login-cancel"
                                    type="button"
                                    onClick={() => {
                                        setEmail('');
                                        setPassword('');
                                        setError(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>

                            <p className="msn-login-signup">
                                Não possui um Windows Live ID? <Link to="/register">Inscreva-se</Link>
                            </p>
                        </form>
                    </div>
                </div>

                <footer className="msn-login-footer" aria-hidden="true">
                    <span>Declaração de privacidade</span>
                    <span>Termos de uso</span>
                    <span>Status do servidor</span>
                    <span>Sobre</span>
                </footer>
            </main>
        </div>
    )
}
