import React, { useState } from 'react';
import { FaAddressCard } from 'react-icons/fa';
import './ProfileMenu.css'; // Certifique-se de criar este arquivo CSS

const ProfileMenu = () => {
    const [open, setOpen] = useState(false);

    // Recupera os dados do usuário do localStorage
    const userName = localStorage.getItem('nome');
    const userEmail = localStorage.getItem('email');

    const toggleMenu = () => setOpen(!open);

    return (
        <div className="profile-menu-container">
            <div className="profile-icon" onClick={toggleMenu}>
                <FaAddressCard size={38} color="white" />
            </div>
            {open && (
                <div className="dropdown-menu">
                    <p><strong>{userName}</strong></p>
                    <p>{userEmail}</p>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
