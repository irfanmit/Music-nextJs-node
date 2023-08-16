'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect to home page if authenticated
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const graphqlQuery = {
      query: `
        {
          login(email: "${username}", password: "${password}") {
            token 
            userId
          }
        }
      `,
    };

    console.log('GraphQL Query:', graphqlQuery);
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors && res.errors[0].status === 401) {
          console.log( "erorororororororororororor " + res.errors[0].message)
          setError(res.errors[0].message);
          throw new Error('User login failed');
        }
        if (res.errors) {
          console.log( "erorororororororororororor " + res.errors[0].message)
          console.log(res.errors);
          setError(res.errors[0].message);
          throw new Error('User login failed');
        }

        console.log(res);
        alert('Success');

        setIsAuthenticated(true);
        localStorage.setItem('token', res.data.login.token);
        localStorage.setItem('userId', res.data.login.userId);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
        <h2 className={styles.formTitle}>Login</h2>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formActions}>
          <button type="submit">Login</button>
        
        </div>
      <Link href="/ForgotPass"><p className={ styles.Forgotpass}>Forgot pass?</p></Link>
      </form>
    </div>
  );
};

export default Login;


