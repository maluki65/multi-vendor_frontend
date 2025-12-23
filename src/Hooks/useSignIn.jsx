import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

function useSignIn() {

  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SignInUser = async (values) => {
    try {
      setError('');
      setIsLoading(true);

      await login(values.email, values.password);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'failed to login');
      return false
    } finally {
      setIsLoading(false);
    }
  }
  return (
    SignInUser, error, isLoading
  )
}

export default useSignIn