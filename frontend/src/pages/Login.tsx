import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { api } from '../services/api';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }
        if (pin.length < 4) {
            setError('PIN must be 4 digits');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const data = await api.auth.login({ email, pin });
            localStorage.setItem('token', data.token);
            navigate('/equipment');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials.');
            setPin('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container flex-center">
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: 'var(--spacing-xl) var(--spacing-lg)', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <img src="/logo-full.png" alt="Checkta Logo" style={{ maxWidth: '260px', width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <p className="text-muted" style={{ marginBottom: '2.5rem', fontWeight: 500 }}>
                    Log in with your email and PIN
                </p>
                <form onSubmit={handleLogin} className="animate-fade-in">
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            style={{ textAlign: 'left', padding: '1rem', height: '56px' }}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="form-input"
                            placeholder="••••"
                            value={pin}
                            onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                            style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '1rem', padding: '1rem', height: '80px', borderColor: error ? 'var(--danger)' : 'var(--border-color)' }}
                            maxLength={4}
                            disabled={isLoading}
                        />
                        {error && <p className="text-danger animate-fade-in" style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'left' }}>{error}</p>}
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        isLoading={isLoading}
                        disabled={pin.length < 4 || !email}
                        style={{ height: '56px', fontSize: '1.125rem' }}
                    >
                        LOGIN
                    </Button>
                </form>
            </div>
        </div>
    );
}
```

Save the file, then run these three commands in the VS Code terminal:

**Command 1:**
```
git add.
```
**Command 2:**
```
git commit - m "fix: add email field to login page"
    ```
**Command 3:**
```
git push