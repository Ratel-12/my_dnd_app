import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push("/users");
    }

    const navStyle = {
        paddingBottom: '20px'
    };

    const buttonStyle = {
        marginRight: '10px',
        padding: '5px 15px', 
        textDecoration: 'none',
        color: 'white', 
        backgroundColor: 'blue',
        border: '1px solid darkblue', 
        borderRadius: '5px', 
        cursor: 'pointer'
    };

    return (
        <nav style={navStyle}>
            {isAuthenticated() ? (
                <>
                    <Link to={`/user/${currentUser.userId}/monsters`} style={buttonStyle}>My Monsters ({currentUser.username})</Link>
                    <Link to="/create-monster" style={buttonStyle}>Add Monster</Link>
                    <Link to="/change-password" style={buttonStyle}>Change Password</Link>
                    <Link to="/delete-account" style={buttonStyle}>Delete Account</Link>
                    <Link to="#" onClick={handleLogout} style={buttonStyle}>Logout</Link>
                    <Link to="/users" style={buttonStyle}>User List</Link>
                </>
            ) : (
                <>
                    <Link to="/login" style={buttonStyle}>Login</Link>
                    <Link to="/register" style={buttonStyle}>Register</Link>
                    <Link to="/users" style={buttonStyle}>User List</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
