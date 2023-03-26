import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todoList, setTodoList] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const res = await axios.post('http://localhost:8080/register', { name, password });
      } else {
        const res = await axios.post('http://localhost:8080/login', { name, password });
        localStorage.setItem('jwt', res.data.token);
        setIsLoggedIn(true);
        setTodoList(res.data.todoList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <TodoList todoList={todoList} />
          <button onClick={() => {
            setIsLoggedIn(false)
            setName('')
            setPassword('')
            localStorage.setItem('jwt', '')
          }}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
          </form>
          <br />
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </button>
        </>
      )}
    </div>
  );
};

export default Login;