'use client';

import { useEffect, useState } from 'react';

interface User {
    nombre: string;
    
    //... other properties from your user data
}
export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);  // Use the User interface
 
    useEffect(() => {
        const token = localStorage.getItem('token'); // Obtener el token

        if (token) {
            // Verificar el token y obtener los datos del usuario (puedes usar fetch o axios)
            fetch('http://localhost:3001/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => console.error(err));
        } else {
            // Si no hay token, redirigir al login
            window.location.href = '/login';
        }
    }, []);

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Bienvenido, {user.nombre}</h1>
            {/* Resto del contenido del dashboard */}
        </div>
    );
}