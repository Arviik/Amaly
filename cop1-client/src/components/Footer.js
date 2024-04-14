import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 mt-8">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Association Cop1 - Tous droits réservés.</p>
                <p>Plus d'infos, contactez-nous à info@cop1.org.</p>
            </div>
        </footer>
    );
};

export default Footer;
