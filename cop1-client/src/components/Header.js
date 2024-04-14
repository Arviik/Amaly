import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">Association Cop1</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/events">Événements</Link></li>
                        <li><Link to="/about">À propos</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
