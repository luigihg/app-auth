'use client';

import { useEffect, useState } from 'react';

interface User {
    nombre: string;
    email: string;
    //... other properties from your user data
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);  // Use the User interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login'; // Redirect if no token
            return; // Important: Stop further execution of the effect
        }

        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    const errorData = await response.json();// Try to parse the error message
                    setError(errorData.error || 'Error al obtener el perfil.');
                    localStorage.removeItem('token'); // Clear invalid token
                    window.location.href = '/login'; // Redirect to login
                }

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError('Ocurrió un error inesperado.');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []); // Empty dependency array ensures this runs only once on mount

    if (loading) {
        return <div>Cargando perfil...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }


    if (!user) {
        return <div>No se ha encontrado el usuario.</div>; // Should not happen with redirect
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Bienvenido, {user.nombre}!</p>
            {/* Rest of your dashboard content here */}
            <p>Email: {user.email}</p>
            {/* ... other user details */}
        </div>
    );
}