const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
require('./config/associations');
const cors = require('cors');

const userRoutes = require('./routes/users');
const monsterRoutes = require('./routes/monsters');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/monsters', monsterRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'D&D Monster Database API' });
});

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
