'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const SignOutPage = () => {
const router = useRouter();
  useEffect(() => {
   
    setTimeout(() => {
      router.push('/'); // Redirect to home page after sign-out
    }, 4000); // Wait for 3 seconds before redirecting
  }, []);
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h2>Sign Out Successful</h2>
      <p>You have been successfully signed out.</p>
      <p>Redirecting to the home page...</p>
    </div>
  );
};

export default SignOutPage;
