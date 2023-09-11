import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useParams, useHistory } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const EditMonster = () => {
    const { currentUser } = useContext(AuthContext);
    const { monsterId } = useParams();
    const history = useHistory();
    
    const [monster, setMonster] = useState(null);
    const [formulas, setFormulas] = useState([]);

    useEffect(() => {
        const fetchMonster = async () => {
            try {
                const response = await axios.get(`/api/monsters/${monsterId}`);
                setMonster(response.data);
                setFormulas(response.data.formulas || []);
            } catch (error) {
                console.error('Error fetching monster details:', error);
            }
        };

        fetchMonster();
    }, [monsterId]);

    const handleRemoveFormula = (index) => {
        const newFormulas = [...formulas];
        newFormulas.splice(index, 1);
        setFormulas(newFormulas);
    }

    const handleAddFormula = () => {
        setFormulas([...formulas, { name: '', diceFormula: '' }]);
    }

    const handleUpdateMonster = async () => {
        try {
            const updatedMonster = {
                ...monster,
                formulas
            };
            await axios.put(`/api/monsters/${monsterId}`, updatedMonster, { headers: { 'Authorization': `Bearer ${currentUser.token}` } });
            history.push(`/monster-details/${monsterId}`);
        } catch (error) {
            console.error('Error updating monster:', error);
        }
    };

    if (!monster) return <p>Loading...</p>;

    return (
        <div>
            <input type="text" value={monster.name} onChange={e => setMonster({ ...monster, name: e.target.value })} />
            <textarea value={monster.description} onChange={e => setMonster({ ...monster, description: e.target.value })} />
            <input type="number" value={monster.str} onChange={e => setMonster({ ...monster, str: e.target.value })} />
            <input type="number" value={monster.dex} onChange={e => setMonster({ ...monster, dex: e.target.value })} />
            <input type="number" value={monster.con} onChange={e => setMonster({ ...monster, con: e.target.value })} />
            <input type="number" value={monster.int} onChange={e => setMonster({ ...monster, int: e.target.value })} />
            <input type="number" value={monster.wis} onChange={e => setMonster({ ...monster, wis: e.target.value })} />
            <input type="number" value={monster.cha} onChange={e => setMonster({ ...monster, cha: e.target.value })} />
            <input type="number" value={monster.pb} onChange={e => setMonster({ ...monster, pb: e.target.value })} />
            {formulas.map((formula, index) => (
                <div key={index}>
                    <input type="text" value={formula.name} onChange={e => {
                        const newFormulas = [...formulas];
                        newFormulas[index].name = e.target.value;
                        setFormulas(newFormulas);
                    }} />
                    <input type="text" value={formula.diceFormula} onChange={e => {
                        const newFormulas = [...formulas];
                        newFormulas[index].diceFormula = e.target.value;
                        setFormulas(newFormulas);
                    }} />
                    <button onClick={() => handleRemoveFormula(index)}>X</button>
                </div>
            ))}
            <button onClick={handleAddFormula}>Add Formula</button>
            <button onClick={handleUpdateMonster}>Update Monster</button>
        </div>
    );
}

export default EditMonster;
