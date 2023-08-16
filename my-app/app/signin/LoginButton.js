"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

const LoginButton = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem('token')

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            authentication
          }
        `,
      }),
    })
    .then(res=>{
      return res.json();
    }).then(res => {
      console.log(res);
      if(res.erros && res.errors[0].status===420){
        setIsAuthenticated(false);
      }
      if (res.errors) {
        console.log(res.errors);
        throw new Error('User login failed');
      }
      setIsAuthenticated(true);
    })
    .catch(error => {
      console.error(error);
      setIsAuthenticated(false);
    });// Make sure to include an empty dependency array here

  const handleSignOut = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/signout');
  };

  const handleClick = (event) => {
    event.preventDefault();
    router.push('/signin');
  };

  return (
    <button 
      onClick={isAuthenticated ? handleSignOut : handleClick}
      className="btn btn-outline-primary mr-2"
    >
      {isAuthenticated ? 'Sign Out' : 'Sign In'}
    </button>
  );
};

export default LoginButton;
