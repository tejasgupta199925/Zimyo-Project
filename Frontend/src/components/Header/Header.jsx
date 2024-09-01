import React from 'react';
import './Header.css';
import cart from '../../assets/Cart.png';
import profile from '../../assets/Profile.png';

function Header({ onProfileClick }) {
    return (
        <header className="header">
            <h1>Zimyo</h1>
            <div className="icons">
                <img src={cart} alt="cart" className="header-icon" />
                <img src={profile} alt="profile" className="header-icon" onClick={onProfileClick} />
            </div>
        </header>
    );
}

export default Header;
