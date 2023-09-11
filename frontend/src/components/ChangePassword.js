import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

axios.defaults.baseURL = 'http://localhost:5000';

const ChangePassword = () => {
    const { currentUser } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage('New password and confirmation do not match.');
            return;
        }

        try {
            const response = await axios.put(`/api/users/change-password/${currentUser.userId}`, {
                oldPassword: currentPassword,
                newPassword
            }, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });

            if (response.data.message === 'Password updated successfully') {
                setMessage('Password changed successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage('Error changing password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('Failed to change password. Please try again.');
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <div>
                <label>
                    Current Password:
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    New Password:
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Confirm New Password:
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
            </div>
            <button onClick={handleChangePassword}>Change Password</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ChangePassword;
