import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';


const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.get('http://localhost:8080/todo', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setName(res.data.name)
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

  // edit todo text (currently not in use/working, was focusing on checkbox function)
  const handleEditTodo = (id) => {
    axios.put(`http://localhost:8080/todo/${id}`, {id}, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
      .then(() => console.log('idk what to do now'))
      .catch(err => console.log(err));
  }

  // checkbox complete: true/false. 
  const updateTodo = (todo) => {
    const data = {id:todo._id,complete:!todo.complete}
    axios.post(`http://localhost:8080/todos`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
    .then(() => {
      const newTodos = todos.map(t => {
      if (t._id === todo._id) {
        t.complete = !t.complete
      }
      return t;
    })
    setTodos([...newTodos])
    })
  }

  return (
    <div>
      <h1> Welcome {name}</h1>
      <TodoForm onSubmit={addTodo} />
      {/* instead of seperate todo component, mapped todos here for easier access */}
      {todos && todos.map(todo => (
        <li key={todo._id}>
        <input
        type={'checkbox'}
        checked={todo.complete}
        onClick={() => updateTodo(todo)}
        ></input>
        {todo.text}
        <button onClick={() => handleDeleteTodo(todo._id)}>X</button>
      </li>
    ))}
    </div>
  );

};

export default TodoList;
