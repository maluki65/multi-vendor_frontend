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

      const res = await login(values.email, values.password);
      return res;
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
      return false
    } finally {
      setIsLoading(false);
    }
  };

  return { SignInUser, error, isLoading };
  
}

export default useSignIn