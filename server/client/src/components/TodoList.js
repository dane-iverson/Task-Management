import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import './TodoList.css';



const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState('');

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

  const onEditTodo = (todoId) => {
    setEditingTodoId(todoId);
  };

  const addTodo = (todo) => {
    axios.post('http://localhost:8080/todo', { todo }, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
      .then(res => {
        const newTodo = { ...todo, id: res.data.id }; // Add a unique key
        setTodos([newTodo, ...todos])
      })
      .catch(err => console.log(err.message));
  };

  const handleDeleteTodo = (id) => {
    axios
      .delete(`http://localhost:8080/todo/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      })
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // // edit todo text (currently not in use/working, was focusing on checkbox function)
  // const handleEditTodo = (id) => {
  //   axios.put(`http://localhost:8080/todo/${id}`, { id }, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
  //     .then(() => console.log('idk what to do now'))
  //     .catch(err => console.log(err));
  // }

  const onSaveEditedTodoText = (todo) => {
    axios
      .put(
        `http://localhost:8080/todo/${todo._id}`,
        { text: editedTodoText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
      )
      .then(() => {
        const newTodos = todos.map(t => {
          if (t._id === todo._id) {
            t.text = editedTodoText;
          }
          return t;
        });
        setTodos(newTodos);
        setEditingTodoId(null);
        setEditedTodoText('');
      })
      .catch((err) => console.log(err));
  };

  // checkbox complete: true/false. 
  const updateTodo = (todo) => {
    const data = { id: todo._id, complete: !todo.complete }
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
    <div className='todo-form'>
      <h1 className='todo-header'>Welcome {name}</h1>
      <TodoForm onSubmit={addTodo} />
      {todos &&
        todos.map((todo) => (
          <li key={todo._id} className='todo-item'>
            {editingTodoId === todo._id ? (
              <>
                <input
                  type="text"
                  defaultValue={todo.text}
                  onChange={(e) => setEditedTodoText(e.target.value)}
                  className='todo-input'
                />
                <button onClick={() => onSaveEditedTodoText(todo)} className='todo-button'>Save</button>
                <button onClick={() => setEditingTodoId(null)} className='todo-button'>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type={'checkbox'}
                  checked={todo.complete}
                  onChange={() => updateTodo(todo)}
                  className='todo-checkbox'
                ></input>
                <span className='todo-text'>{todo.text}</span>
                <button onClick={() => onEditTodo(todo._id)} className='todo-button'>Edit</button>
                <button onClick={() => handleDeleteTodo(todo._id)} className='todo-button'>X</button>
              </>
            )}
          </li>
        ))}
    </div>
  );


};

export default TodoList;
