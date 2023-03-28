import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import './TodoList.css';



const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState('');
  const [editedTodoDate, setEditedTodoDate] = useState('');
  const [filter, setFilter] = useState('Incomplete')
  const [users, setUsers] = useState([]);
  let selectedUser = '';


  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.get('http://localhost:8080/todo', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setName(res.data.name)
          setTodos(res.data.todoList)
        })
        .catch(err => console.log(err));

      axios.get('http://localhost:8080/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUsers(res.data)
          // setName(res.data[0].name)
          // setTodos(res.data[0].todoList)
        })
        .catch(err => console.log(err));

    }
  }, []);

  const onEditTodo = (todoId) => {
    setEditingTodoId(todoId);
  };

  const addTodo = (todo) => {
    const selectedUser = document.getElementById("usersDropdown").value;

    axios.post('http://localhost:8080/todo', { todo, selectedUser }, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
      .then(res => {
        if (selectedUser === name) {
          const newTodo = { ...todo, id: res.data.id }; // Add a unique key
          setTodos([newTodo, ...todos])
        }
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

  //edit todo
  const onSaveEditedTodoText = (todo) => {
    axios
      .put(
        `http://localhost:8080/todo/${todo._id}`,
        { text: editedTodoText, deadline: editedTodoDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
      )
      .then(() => {
        const newTodos = todos.map(t => {
          if (t._id === todo._id) {
            t.text = editedTodoText;
            t.deadline = editedTodoDate;
          }
          return t;
        });
        setTodos(newTodos);
        setEditingTodoId(null);
        setEditedTodoText('');
        setEditedTodoDate('')
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

  const getTodos = () => {
    switch (filter) {
      case 'all':
        return todos;
      case 'completed':
        return todos.filter((todo) => todo?.complete)
      case 'incomplete':
        return todos.filter((todo) => !todo?.complete)
      default:
        return todos;
    }
  }


  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  return (
    <div className='todo-form'>
      <h1 className='todo-header'>Welcome {name}</h1>
      <TodoForm onSubmit={(todo) => addTodo({ ...todo, userId: selectedUser._id })} />
      <select onChange={(e) => changeFilter(e.target.value)}>
        <option value='all'>All</option>
        <option value='completed'>Completed</option>
        <option value='incomplete'>Incomplete</option>
      </select>
      <select className="usersDropdown" id='usersDropdown' onChange={(e) => {
        selectedUser = users.find((user) => user.name === e.target.value);
        getTodos();
      }}>
        {users.map((user) => (
          <option key={user._id} value={user.name}>{user.name}</option>
        ))}
      </select>
      {getTodos().map((todo) => (
        <li key={todo._id} className='todo-item'>
          {editingTodoId === todo._id ? (
            <>
              <input
                type="text"
                defaultValue={todo.text}
                onChange={(e) => setEditedTodoText(e.target.value)}
                className='todo-input'
              />
              <input
              type="date"
              defaultValue={todo.deadline}
              onChange={(e) => setEditedTodoDate(e.target.value)}
              className='date-input'
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
              <br />
              <button>Due: {todo.deadline}</button>
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
