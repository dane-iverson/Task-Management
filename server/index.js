const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/user.model')
const { updateOne } = require('./models/user.model');
var ObjectID = require('mongodb').ObjectID;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/resource', (req, res) => {
    const auth = req.headers['authorization']
    const token = auth.split(' ')[1]
    try {
        const decoded = jwt.verify(token, 'jwt-secret')
        res.send({
            'msg':
                `Hello, ${decoded.name}! Your JSON Web Token has been verified.`
        })
    } catch (err) {
        res.status(401).send({ 'err': 'Bad JWT!' })
    }
})

// login request
app.post('/login', (req, res) => {
    const { name, password } = req.body;
    User.findOne({ name: name, password: password }, async (err, user) => {
        if (err) {
            res.status(500).send({ 'msg': 'Server Error' });
        } else if (!user) {
            res.status(404).send({ 'msg': 'User not found' });
        } else {
            const payload = {
                name: user.name,
                todoList: user.todoList
            };
            const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', { algorithm: 'HS256' });
            res.send({ 'msg': 'Login Successful!', 'token': token });
        }
    }
    )
});

// create account
app.post('/register', (req, res) => {
    debugger
    const { name, password } = req.body;
    const newUser = new User({ name, password });
    console.log(name + password);
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send(err.message);
            console.log(err.message)
        } else {
            const payload = {
                name: user.name,
                todoList: user.todoList
            };
            const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', { algorithm: 'HS256' });
            res.send({ 'msg': 'Account created successfully!', 'token': token });
        }
    });
});

// fetch todos
app.get('/todo', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        // find the user in the database with the id in the decoded token
        console.log(decoded.name)
        User.findOne({ name: decoded.name }).lean().exec((err, user) => {
            if (err) return res.status(500).send({ 'msg': 'Error finding the user.' });
            if (!user) return res.status(404).send({ 'msg': 'User not found.' });
            // return the user's todo list
            console.log(user)
            res.status(200).send(user);
        });
    } catch (e) {
        res.status(401).send({ 'msg': 'Invalid token.' });
    }
});

// add todos
app.post('/todo', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        // find the user in the database with the id in the decoded token
        User.findOne({ name: decoded.name }, (err, user) => {
            if (err) return res.status(500).send({ msg: 'Error finding the user.' });
            if (!user) return res.status(404).send({ msg: 'User not found.' });
            console.log('request body:', req.body);
            user.todoList.push(req.body.todo);
            user.save((err) => {
                if (err) return res.status(500).send({ msg: 'Error saving the user.' });
                const newTodo = user.todoList[user.todoList.length - 1]; // get the last item in the array
                res.status(200).json({ id: newTodo._id, todo: newTodo.value });
            });
        });
    } catch (e) {
        res.status(401).send({ 'msg': 'Invalid token.' });
    }
});


// delete todos
app.delete('/todo/:id', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        User.findOne({ name: decoded.name }, (err, user) => {
            if (err) return res.status(500).send({ 'msg': 'Error finding the user.' });
            if (!user) return res.status(404).send({ 'msg': 'User not found.' });
            const todo = user.todoList.find(todo => todo._id.toString() === req.params.id);
            if (!todo) return res.status(404).send({ 'msg': 'Todo not found.' });
            user.todoList.pull(todo);
            user.save((err, user) => {
                if (err) return res.status(500).send({ 'msg': 'Error saving the user.' });
                res.status(200).send({ 'msg': 'Todo deleted.' });
            });
        });
    } catch (e) {
        res.status(401).send({ 'msg': 'Invalid token.' });
    }
});

app.put('/todo/:id', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        User.findOne({ name: decoded.name }, (err, user) => {
            if (err) return res.status(500).send({ 'msg': 'Error finding the user.' });
            if (!user) return res.status(404).send({ 'msg': 'User not found.' });
            const todo = user.todoList.id(req.params.id);
            if (!todo) return res.status(404).send({ 'msg': 'Todo not found.' });
            todo.text = req.body.text;
            user.save((err, user) => {
                if (err) return res.status(500).send({ 'msg': 'Error saving the user.' });
                res.status(200).send({ 'msg': 'Todo updated' })
            });
        });
    } catch (e) {
        res.status(401).send({ 'msg': 'Invalid token.' })
    }
})

app.post('/todos', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        User.findOne({ name: decoded.name }, (err, user) => {
            if (err) return res.status(500).send({ 'msg': 'Error finding the user.' });
            if (!user) return res.status(404).send({ 'msg': 'User not found.' });
            const todo = user.todoList.id(req.body.id);
            if (!todo) return res.status(404).send({ 'msg': 'Todo not found.' });
            todo.complete = req.body.complete;
            user.save((err, user) => {
                if (err) return res.status(500).send({ 'msg': 'Error saving the user.' });
                res.status(200).send({ 'msg': 'Todo updated' })
            });
        });
    } catch (e) {
        res.status(401).send({ 'msg': 'Invalid token.' })
    }
})

// connect to host
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// mongoDB connection
const uri = "mongodb+srv://DaneIverson:Daneci29@cluster0.5aju5ci.mongodb.net/pineapple?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (req, res) => {
    console.log('MongoDB connected...')
})