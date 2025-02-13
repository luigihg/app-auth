'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Set loading to true

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard'; // Redirect on success
            } else {
                setError(data.error || 'Credenciales incorrectas.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false); // Set loading to false, regardless of outcome
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded mb-2"
                />

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading} // Disable the button while loading
                >
                    {loading ? 'Cargando...' : 'Iniciar Sesión'} {/* Show loading text */}
                </button>
            </form>
            <div className="mt-4 text-center"> {/* Add some spacing and center the text */}
            <Link href="/registro" className="text-blue-500 hover:underline">
                ¿No tienes una cuenta? Regístrate
            </Link>
        </div>
        </div>
    );
}