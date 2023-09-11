import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useHistory } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const CreateMonster = () => {
    const { currentUser } = useContext(AuthContext);
    const history = useHistory();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [str, setStr] = useState('');
    const [dex, setDex] = useState('');
    const [con, setCon] = useState('');
    const [int, setInt] = useState('');
    const [wis, setWis] = useState('');
    const [cha, setCha] = useState('');
    const [pb, setPb] = useState('');
    const [formulas, setFormulas] = useState([{ name: '', diceFormula: '' }]);

    const handleAddFormula = () => {
        setFormulas([...formulas, { name: '', diceFormula: '' }]);
    }

    const handleFormulaChange = (index, field, value) => {
        const newFormulas = [...formulas];
        newFormulas[index][field] = value;
        setFormulas(newFormulas);
    }

    const handleRemoveFormula = (index) => {
        const newFormulas = [...formulas];
        newFormulas.splice(index, 1);
        setFormulas(newFormulas);
    }

    const handleCreateMonster = async () => {
        try {
            const monsterData = { name, description, str, dex, con, int, wis, cha, pb, formulas };
            await axios.post('/api/monsters', monsterData, { headers: { 'Authorization': `Bearer ${currentUser.token}` } });
            history.push('/users');
        } catch (error) {
            console.error('Error creating monster:', error);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
            <textarea placeholder="Description" onChange={e => setDescription(e.target.value)} />
            <input type="number" placeholder="STR" onChange={e => setStr(e.target.value)} />
            <input type="number" placeholder="DEX" onChange={e => setDex(e.target.value)} />
            <input type="number" placeholder="CON" onChange={e => setCon(e.target.value)} />
            <input type="number" placeholder="INT" onChange={e => setInt(e.target.value)} />
            <input type="number" placeholder="WIS" onChange={e => setWis(e.target.value)} />
            <input type="number" placeholder="CHA" onChange={e => setCha(e.target.value)} />
            <input type="number" placeholder="Proficiency Bonus" onChange={e => setPb(e.target.value)} />

            {formulas.map((formula, index) => (
                <div key={index}>
                    <input type="text" placeholder="Formula Name" value={formula.name} onChange={e => handleFormulaChange(index, 'name', e.target.value)} />
                    <input type="text" placeholder="Dice Formula" value={formula.diceFormula} onChange={e => handleFormulaChange(index, 'diceFormula', e.target.value)} />
                    <button onClick={() => handleRemoveFormula(index)}>X</button>
                </div>
            ))}
            <button onClick={handleAddFormula}>Add Formula</button>
            <button onClick={handleCreateMonster}>Create Monster</button>
        </div>
    );
}

export default CreateMonster;
