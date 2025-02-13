'use client';

import { useState } from 'react';
import type { FormEvent } from 'react'; // Importa el tipo FormEvent

export default function Registro() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // Correct type for error state
    const [success, setSuccess] = useState<string | null>(null); // Correct type for success state

    

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); // Limpia mensajes de error previos
        setSuccess(null); // Limpia mensajes de éxito previos

        try {
            const response = await fetch('http://localhost:3001/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registro exitoso. ¡Puedes iniciar sesión!');
                // Limpiar el formulario (opcional):
                setNombre('');
                setEmail('');
                setPassword('');
            } else {
                setError(data.error || 'Error en el registro.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="container mx-auto p-4"> {/* Centrar el formulario */}
            <h1 className="text-2xl font-bold mb-4">Registro</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="max-w-md mx-auto"> {/* Ajustar ancho del formulario */}
                <input 
                    type="text" 
                    placeholder="Nombre" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border rounded mb-2"  
                />
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
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> {/* Estilos para el botón */}
                    Registrarse
                </button>
            </form>
        </div>
    );
}