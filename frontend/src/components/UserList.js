import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>User List</h1>
            {users.map(user => (
                <div key={user.id}>
                    <Link to={`/user/${user.id}/monsters`}>{user.username}</Link>
                </div>
            ))}
        </div>
    );
}

export default UserList;
