import { useState } from 'react';
import api from './api';

export default function Register({ onRegister, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/register', { username, email, password });
            const { token, username: returnedUsername } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', returnedUsername);
            onRegister(returnedUsername);
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError(err.response.data || 'Username or email already taken.');
            } else if (err.response && err.response.status === 400) {
                setError('Please check your details (password needs 6+ characters).');
            } else {
                setError('Registration failed. Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '320px', margin: '80px auto', color: '#fff', fontFamily: 'Arial' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password (6+ characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                />
                {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin} style={{ textDecoration: 'underline' }}>
                    Log In
                </button>
            </p>
        </div>
    );
}
