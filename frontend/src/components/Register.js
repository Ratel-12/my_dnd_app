import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const Register = () => {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('api/users/register', { username, password });
            history.push('/login');
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;
