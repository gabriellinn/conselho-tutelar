import React, { useEffect, useState } from "react"

import logo from "../assets/logo.png"
import { IoPerson } from "react-icons/io5";

import { Link } from 'react-router-dom';

const NavBar = () => {
    const [hasAdminAccess, setHasAdminAccess] = useState(false);

    useEffect(() => {
        // Verificar se o usuário é secretário ou admin
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                // Admin e secretário têm acesso às páginas de gerenciamento
                setHasAdminAccess(user.cargo === 'secretario' || user.cargo === 'admin');
            } catch (error) {
                console.error('Erro ao ler informações do usuário:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    };

    return (
        <>
            <nav className="navbar bg-white fixed-top justify-content-end px-5 py-3 shadow-lg">
                <div className="w-100 d-flex align-items-center justify-content-between">
                    <div>
                        <Link to="/home"><img src={logo} style={{ width: "80px" }} /></Link>
                    </div>
                    <div className="d-flex">
                        <Link to="/home/mapas"><button type="button" className="btn btn-primary me-3">Mapa</button></Link>
                        {hasAdminAccess && (
                            <Link to="/home/perfil-administrador">
                                <button type="button" className="btn btn-primary me-3">
                                    <IoPerson />Perfil
                                </button>
                            </Link>
                        )}
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary me-3" 
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar