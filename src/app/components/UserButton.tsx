import React from 'react';
import { useState } from 'react';

const UserButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userName = 'John Doe'; // Replace with dynamic user name

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        // Add logout functionality here
        console.log('Logged out');
    };

    return (
        <div>
            <button onClick={toggleDropdown}>User</button>
            {isOpen && (
                <div className="dropdown">
                    <p>{userName}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserButton;
