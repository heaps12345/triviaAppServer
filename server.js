const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const whitelist = ['http://localhost:3000', 'https://rj-dream-journal.herokuapp.com'];

const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/leaderboard', (req, res) => {
  db.select('*')
    .from('users')
    .orderBy('score', 'desc')
    .then(data => res.json(data))
    .catch(err => res.status(400).json('unable to update Leaderboard'));
});

app.post('/leaderboard', (req, res) => {
  const { name, score } = req.body;
  db('users')
    .insert({ name: name, score: score })
    .then(() =>
      db
        .select('*')
        .from('users')
        .orderBy('score', 'desc')
        .then(list => {
          res.json(list);
        })
    );
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`app is running on port ${PORT}`);
});
