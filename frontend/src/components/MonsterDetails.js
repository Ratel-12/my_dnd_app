import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useHistory } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const MonsterDetails = () => {
    const { monsterId } = useParams();
    const [monster, setMonster] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        const fetchMonster = async () => {
            try {
                const response = await axios.get(`/api/monsters/${monsterId}`);
                setMonster(response.data);
            } catch (error) {
                console.error('Error fetching monster details:', error);
            }
        };

        fetchMonster();
    }, [monsterId]);

    function rollDice(num, faces) {
        let total = 0;
        for (let i = 0; i < num; i++) {
            total += Math.floor(Math.random() * faces) + 1;
        }
        return total;
    }

    function evaluateExpression(expression) {
        const validMathExpression = /^[\d+\-*/()\s]*$/;
        if (!validMathExpression.test(expression)) {
            throw new Error("Invalid formula detected.");
        }
        // eslint-disable-next-line no-eval
        return eval(expression);
    }

    function resolveDiceNotation(formula) {
        let result = formula.match(/(\d+|[^d]+)d(\d+|[^d]+)/);
        
        while(result) {
            const [full, left, right] = result;
            const rolls = parseInt(evaluateExpression(left), 10);
            const faces = parseInt(evaluateExpression(right), 10);
            
            formula = formula.replace(full, rollDice(rolls, faces));
            
            result = formula.match(/(\d+|[^d]+)d(\d+|[^d]+)/);
        }

        return formula;
    }

    function getSmallestParenthesesExpression(formula) {
        let regex = /\(([^()]+)\)/;
        return formula.match(regex);
    }

    function evaluateFormula(formula, stats) {
        const bonuses = {
            str: Math.floor(stats.str / 2) - 5,
            dex: Math.floor(stats.dex / 2) - 5,
            con: Math.floor(stats.con / 2) - 5,
            int: Math.floor(stats.int / 2) - 5,
            wis: Math.floor(stats.wis / 2) - 5,
            cha: Math.floor(stats.cha / 2) - 5,
            pb: stats.pb
        };
    
        for (let [key, value] of Object.entries(bonuses)) {
            const regex = new RegExp(`\\[${key}\\]`, 'g');
            formula = formula.replace(regex, value.toString());
        }
    
        let expr = getSmallestParenthesesExpression(formula);
        while(expr) {
            let resolved = resolveDiceNotation(expr[1]);
            formula = formula.replace(expr[0], evaluateExpression(resolved));
            
            expr = getSmallestParenthesesExpression(formula);
        }
    
        formula = resolveDiceNotation(formula);
        return evaluateExpression(formula);
    }

    if (!monster) return <p>Loading...</p>;

    const handleEdit = () => {
        history.push(`/edit-monster/${monsterId}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/monsters/${monsterId}`);
            history.push(`/user/${currentUser.userId}/monsters`);
        } catch (error) {
            console.error('Error deleting the monster:', error);
        }
    };

    return (
        <div>
            {currentUser && currentUser.userId === monster.userId && (
                <div>
                    <button onClick={handleEdit}>Edit Monster</button>
                    <button onClick={handleDelete}>Delete Monster</button>
                </div>
            )}

            <h1>{monster.name}</h1>

            <div className="attributes">
                <p><strong>Strength:</strong> {monster.str}</p>
                <p><strong>Dexterity:</strong> {monster.dex}</p>
                <p><strong>Constitution:</strong> {monster.con}</p>
                <p><strong>Intelligence:</strong> {monster.int}</p>
                <p><strong>Wisdom:</strong> {monster.wis}</p>
                <p><strong>Charisma:</strong> {monster.cha}</p>
                <p><strong>Proficiency Bonus:</strong> {monster.pb}</p>
            </div>

            <p>{monster.description}</p>
                
            {monster.formulas && monster.formulas.map((formula, index) => (
                <div key={index}>
                    <button onClick={() => alert(evaluateFormula(formula.diceFormula, monster))}>
                        {formula.name}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default MonsterDetails;
