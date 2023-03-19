import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import Todo from './Todo';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.get('http://localhost:8080/todo', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          console.log(res.data)
          setTodos(res.data.todoList)
        })
        .catch(err => console.log(err));
    }
  }, []);

  const addTodo = (todo) => {
    axios.post('http://localhost:8080/todo', {todo}, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
      .then(res => setTodos([todo, ...todos]))
      .catch(err => console.log(err.message));
  };

  const handleDeleteTodo = (id) => {
    axios.delete(`http://localhost:8080/todo/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(err => console.log(err));
  }

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      {todos && todos.map(todo => (
        <Todo 
          key={todo._id}
          onDelete={() => handleDeleteTodo(todo._id)}
          todo={todo} 
        />
      ))}
    </div>
  );

};

export default TodoList;
