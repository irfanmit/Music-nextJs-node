"use client"

import { useState } from 'react';
import styles from './page.module.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleSendVerificationEmail = () => {
    // Send the verification email request to the server
    // Implement the logic to send the email to the user's email address here
    setEmailSent(true);
  };

  const handleVerifyEmail = () => {
    // Verify the user's email with the verification code
    // Implement the logic to verify the email here
    setEmailVerified(true);
  };

  const handleSetNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    // Set the new password for the user
    // Implement the logic to update the user's password here
    setMessage('Password updated successfully.');
  };

  return (
    <div className={styles.emailVerify}>
      <h1>Forgot Password</h1>
      {!emailSent && (
        <div>
          <label>Email:</label>
          <input className={styles.inputField}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" onClick={handleSendVerificationEmail}>
            Send Verification Email
          </button>
        </div>
      )}
      {emailSent && !emailVerified && (
        <div className={styles.emailBeingVerified}>
          <label>Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="button" onClick={handleVerifyEmail}>
            Verify Email
          </button>
        </div>
      )}
      {emailVerified && (
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" onClick={handleSetNewPassword}>
            Set New Password
          </button>
          {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
