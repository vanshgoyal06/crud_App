import { useState } from 'react';
import api from './api';

export default function Login({ onLogin, onSwitchToRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, username: returnedUsername } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', returnedUsername);
            onLogin(returnedUsername);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Invalid username or password.');
            } else {
                setError('Login failed. Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '320px', margin: '80px auto', color: '#fff', fontFamily: 'Arial' }}>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToRegister} style={{ textDecoration: 'underline' }}>
                    Register
                </button>
            </p>
        </div>
    );
}
