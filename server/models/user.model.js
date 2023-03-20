const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  password: String,
  todoList: [{
    text: String,
    complete: Boolean
  }]
});
//
const User = mongoose.model('User', userSchema);

module.exports = User;