import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [userType, setUserType] = useState("")
  const [adminKey, setAdminKey] = useState("")

  const handleSubmit = async e => {
    if (userType === "Admin" && adminKey!="0301295856084") {
      e.preventDefault();
      alert("Invalid Admin")
    } else {
    e.preventDefault();
    try {
      if (isRegistering) {
        const res = await axios.post('http://localhost:8080/register', { name, password, userType });
      } else {
        const res = await axios.post('http://localhost:8080/login', { name, password, userType }); // here
        localStorage.setItem('jwt', res.data.token);
        setIsLoggedIn(true);
        setTodoList(res.data.todoList);
      }
    } catch (err) {
      alert("Invalid Username or Password")
    }
  };}
    

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
          <button onClick={() => {
            setIsLoggedIn(false)
            setName('')
            setPassword('')
            localStorage.setItem('jwt', '')
          }}>
            Log Out
          </button>
          <TodoList todoList={todoList} />
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <h2>
            {isRegistering ? 'Register' : 'Login'}
            </h2>
            {isRegistering ? 'Register as ' : 'Login as '}
              <div>
                <input 
                type="radio"
                name='userType'
                value="User"
                onChange={(e) => setUserType(e.target.value)}
                />
                User
                <input 
                type="radio"
                name='userType'
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
                />
                Admin
              </div>
              {userType === "Admin" ? 
              <div>
                <label>Admin Key:</label>
                <input 
                type="text"
                className='admin-key'
                placeholder='admin-key'
                onChange={(e) => setAdminKey(e.target.value)}
                />
              </div>
              :
              null
              }
              


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