import React from "react";

import './css/navbar.css';
import Logo from './assets/img/new_logo.png';

const electron = window.require("electron");
const { ipcRenderer } = electron;


const Navbar = () => {
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('name');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        ipcRenderer.send('remove_user', { message: 'remove user' });
        console.log("logout");
    };

    const name = localStorage.getItem("name");
    const email = localStorage.getItem('email');

    return (<div className="navbar">
        <img src={Logo} alt="app logo" />
        <div className="list-items">
            <div className="list-choice">
                <div className="list-choice-title">Profile</div>
                <div className="list-choice-objects">
                    <label>
                        <input type="radio" name="month" />
                        <span>
                            Name:{name}
                            <br />
                            Email:{email}
                        </span>
                    </label>
                </div>
            </div>
            <a href="/#/" onClick={handleLogout}>logout</a>
        </div>
    </div>)
}

export default Navbar;