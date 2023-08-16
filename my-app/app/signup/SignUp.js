"use client"

import { useRouter } from 'next/navigation'; // Correct the import statement

const SignUp = () => {
  const router = useRouter(); // Move the useRouter hook inside the functional component

  const handleClick = (event) => {
    event.preventDefault();
    router.push('/signup');
  };

  return (
    
    <button onClick={handleClick} className="btn btn-primary">Sign Up</button>
  
  );
};

export default SignUp;
