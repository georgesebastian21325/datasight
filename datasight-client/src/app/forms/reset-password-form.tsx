'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Retrieve the user object from sessionStorage
      const userChallenge = sessionStorage.getItem('userChallenge');
      if (!userChallenge) {
        setError('No user session found. Please log in again.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userChallenge);

      // Complete the password reset process
{ /*     await completeNewPassword(user, newPassword);
    console.log('Password updated and user confirmed'); */}

      // Clear the session storage
      sessionStorage.removeItem('userChallenge');

      // Redirect the user to the dashboard or another appropriate page
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Error resetting password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
