// DeleteAccount.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useHistory } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const DeleteAccount = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const history = useHistory();

    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleDeleteAccount = async () => {
        if (!password) {
            setMessage('Please enter your password to confirm account deletion.');
            return;
        }
    
        try {
            const response = await axios.delete(`/api/users/${currentUser.userId}`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
                data: { password }
            });
    
            if (response.data.message === 'Account deleted successfully') {
                setCurrentUser(null);
                history.push('/user-list');
            } else {
                setMessage('Error deleting account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage('Failed to delete account. Please try again.');
        }
    };
    

    return (
        <div>
            <h2>Delete Account</h2>
            <p>Warning: This action will permanently delete your account and all associated data.</p>
            <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />
            {message && <p>{message}</p>}
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
}

export default DeleteAccount;

