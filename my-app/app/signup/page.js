'use client';
import React, { useState } from 'react';
import styles from './page.module.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const graphqlQuery = {
      query: `
      mutation {
        createUser(
          userInput: {email : "${email}", name :"${username}", password: "${password}" 
        }){
            _id
          }
      }
      `
    };

    fetch('http://localhost:8080/graphql',{
      method:'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    }).then(res => {
      return res.json();
    }).then(resData => {   
      if(resData.errors && resData.errors[0].status === 422){
        setError("Validation failed!");
        throw new Error("Validation failed!");
      }
      if(resData.errors){
        console.log(resData)
        if(resData.errors[0].data[0].message){
        setError(resData.errors[0].data[0].message);
        }
        if(resData.errors[0].data[1].message){
          setPasswordError(resData.errors[0].data[1].message);
          }
        throw new Error('User creation failed');
      }
      console.log(resData);
      alert('Successfully signed up');
    }).catch(error => {
      console.error(error);
      // setError('User creation failed');
    });
  };

  return (
    <div className={styles.container}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Signup</h2>
        <div className={styles.formField}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formActions}>
          <button type="submit">Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
