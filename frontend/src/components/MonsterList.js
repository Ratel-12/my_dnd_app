import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const MonsterList = ({ match }) => {
    const userId = match.params.userId;
    const [monsters, setMonsters] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchMonsters = async () => {
            try {
                const monsterResponse = await axios.get(`/api/monsters/user/${userId}`);
                const userResponse = await axios.get(`/api/users/${userId}`);
                setMonsters(monsterResponse.data);
                setUsername(userResponse.data.username);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMonsters();
    }, [userId]);

    return (
        <div>
            <h2>Monsters of the user: {username}</h2>
            <ul>
                {monsters.map(monster => (
                    <li key={monster.id}>
                        <Link to={`/monster-details/${monster.id}`}>{monster.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MonsterList;
