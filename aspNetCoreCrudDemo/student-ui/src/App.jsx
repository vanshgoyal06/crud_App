import { useState } from 'react';
import StudentApp from './StudentApp';
import Login from './Login';
import Register from './Register';

function App() {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [view, setView] = useState('login'); // 'login' | 'register', only used when logged out

    const handleAuthSuccess = (name) => setUsername(name);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUsername(null);
        setView('login');
    };

    if (!username) {
        return view === 'login' ? (
            <Login onLogin={handleAuthSuccess} onSwitchToRegister={() => setView('register')} />
        ) : (
            <Register onRegister={handleAuthSuccess} onSwitchToLogin={() => setView('login')} />
        );
    }

    return <StudentApp username={username} onLogout={handleLogout} />;
}

export default App;
