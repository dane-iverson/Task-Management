const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  password: String,
  userType: String,
  todoList: [{
    text: String,
    deadline: Date,
    complete: Boolean
  }]
});
//
const User = mongoose.model('User', userSchema);

module.exports = User;