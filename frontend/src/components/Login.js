import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await login(username, password);
        history.push('/users');
    };

    return (
        <div>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
