const express = require('express');
const router = express.Router();
const Monster = require('../models/monster');
const Formula = require('../models/formula');
const jwt = require('jsonwebtoken');

const SECRET = 'FOR_TESTING_ONLY_WILL_CHANGE_LATER';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.id;
        next();
    });
}

router.post('/', authenticateToken, async (req, res) => {
    try {
        const monsterData = { ...req.body, userId: req.userId };
        const monster = await Monster.create(monsterData);

        const formulas = req.body.formulas;
        if (formulas && formulas.length > 0) {
            for (let formulaData of formulas) {
                await Formula.create({
                    ...formulaData,
                    monsterId: monster.id
                });
            }
        }

        res.status(201).json({ monster });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const monsters = await Monster.findAll({ where: { userId } });
        res.json(monsters);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch monsters for the user" });
    }
});

router.post('/:monsterId/formulas', authenticateToken, async (req, res) => {
    try {
        const monster = await Monster.findOne({ where: { id: req.params.monsterId } });
        if (monster.userId !== req.userId) {
            return res.status(403).json({ error: "Not authorized to add a formula to this monster" });
        }

        const formula = await Formula.create({
            ...req.body,
            monsterId: req.params.monsterId
        });
        res.status(201).json({ formula });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:monsterId', async (req, res) => {
    try {
        const monsterId = req.params.monsterId;
        const monster = await Monster.findOne({ where: { id: monsterId } });
            
        if (!monster) {
            return res.status(404).json({ error: "Monster not found" });
        }

        const formulas = await Formula.findAll({ where: { monsterId: monster.id } });
        const monsterPlain = monster.toJSON();
        monsterPlain.formulas = formulas;
        res.json(monsterPlain);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch the monster" });
    }
});

router.put('/:monsterId', authenticateToken, async (req, res) => {
    try {
        const monsterId = req.params.monsterId;
        const monster = await Monster.findOne({ where: { id: monsterId } });

        if (monster.userId !== req.userId) {
            return res.status(403).json({ error: "Not authorized to edit this monster" });
        }

        await Formula.destroy({ where: { monsterId } });

        const formulas = req.body.formulas;
        if (formulas && formulas.length > 0) {
            for (let formulaData of formulas) {
                await Formula.create({
                    ...formulaData,
                    monsterId: monsterId
                });
            }
        }
            
        await monster.update(req.body);
        res.json(monster);
    } catch (error) {
        res.status(500).json({ error: "Failed to update the monster" });
    }
});

router.delete('/:monsterId', authenticateToken, async (req, res) => {
    try {
        const monsterId = req.params.monsterId;
        const monster = await Monster.findOne({ where: { id: monsterId } });
            
        if (monster.userId !== req.userId) {
            return res.status(403).json({ error: "Not authorized to delete this monster" });
        }
            
        await monster.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete the monster" });
    }
});

module.exports = router;
