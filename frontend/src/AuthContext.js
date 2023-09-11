import React, { createContext, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    
    const [_currentUser, _setCurrentUser] = useState(null);
    
    const setCurrentUser = user => {
        if (user && user.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        _setCurrentUser(user);
    };

    const isAuthenticated = () => {
        return _currentUser !== null;
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/users/login', {
                username,
                password
            });

            if (response.data && response.data.userId) {
                setCurrentUser({
                    userId: response.data.userId,
                    username: response.data.username,
                    token: response.data.token
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = () => {
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser: _currentUser, setCurrentUser, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
