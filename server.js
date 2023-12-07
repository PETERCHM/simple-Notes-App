const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));

const users = [];
const notes = {};

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Invalid registration data');
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).send('Username already taken');
    }

    const newUser = { username, password };
    users.push(newUser);
    notes[username] = [];

    res.status(200).send('Registration successful');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    req.session.user = username;
    res.status(200).send('Login successful');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logout successful');
});

app.get('/notes', (req, res) => {
    const username = req.session.user;
    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    const userNotes = notes[username];
    res.json(userNotes);
});

app.post('/notes', (req, res) => {
    const username = req.session.user;
    if (!username) {
        return res.status(401).send('Unauthorized');
    }

    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Invalid note data');
    }

    const newNote = { title, content };
    notes[username].push(newNote);
    res.status(200).send('Note added successfully');
});

app.get('/', (req, res) => {
    res.send('Welcome to the NOTE TAKING App');
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
 