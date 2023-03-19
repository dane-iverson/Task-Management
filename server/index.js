const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/user.model')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/resource', (req, res) => {
    const auth = req.headers['authorization']
    const token = auth.split(' ')[1]
    try {
        const decoded = jwt.verify(token, 'jwt-secret')
        res.send({'msg':
      `Hello, ${decoded.name}! Your JSON Web Token has been verified.`})
    }catch (err) {
        res.status(401).send({ 'err': 'Bad JWT!' })
    }
})

// app.post('/login', (req, res) => {
//     const user = req.body.username
//     const password = req.body.password
//     if (user === 'Guest' && password === 'Guest123') {
//         payload = {
//             'name': user,
//             'admin': false
//         }
//         const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', { algorithm: 'HS256' })
//         res.send({'token': token})
//         // res.send(`Username: ${user}\n Password: ${password}`)
//     } else {
//         res.status(403).send('Username or password incorrect.')
//     }
// });

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
)});


app.post('/register', (req, res) => {
    const { name, password } = req.body;
    const newUser = new User({ name, password });
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send(err.message);
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

app.get('/todo', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        // find the user in the database with the id in the decoded token
        console.log(decoded.name)
        User.findOne({name: decoded.name}).lean().exec((err, user) => {
            if (err) return res.status(500).send({'msg': 'Error finding the user.'});
            if (!user) return res.status(404).send({'msg': 'User not found.'});
            // return the user's todo list
            console.log(user)
            res.status(200).send(user);
        });
    } catch (e) {
        res.status(401).send({'msg': 'Invalid token.'});
    }
});

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
          res.status(200).json({ todo: req.body.todo });
        });
      });
    } catch (e) {
      res.status(401).send({ 'msg': 'Invalid token.' });
    }
});

app.delete('/todo/:id', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    try {
        const decoded = jwt.verify(token, 'jwt-secret');
        // find the user in the database with the id in the decoded token
        User.findOne({name: decoded.name}, (err, user) => {
            if (err) return res.status(500).send({'msg': 'Error finding the user.'});
            if (!user) return res.status(404).send({'msg': 'User not found.'});
            // remove the todo from the user's todo list
            user.todolist = user.todolist.filter(todo => todo.id !== req.params.id);
            user.save((err, user) => {
                if (err) return res.status(500).send({'msg': 'Error saving the user.'});
                res.status(200).send({'msg': 'Todo deleted.'});
            });
        });
    } catch (e) {
        res.status(401).send({'msg': 'Invalid token.'});
    }
});



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const uri = "mongodb+srv://DaneIverson:Daneci29@cluster0.5aju5ci.mongodb.net/users?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (req, res) => {
    console.log('MongoDB connected...')
})