import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

function useSignUp() {

  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (values) => {
    /*if (values.password !== values.passwordConfirm) {
      setError("password don't match");
      setSuccess('');
      return false;
    }*/

    try {
      setError('');
      setIsLoading(true);

      const res = await signup(values);
      setSuccess('Account created successfully!');
      return res;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create account');
      return false
    } finally {
      setIsLoading(false);
    }
  };

  return { registerUser, isLoading, error, success };
  
};

export default useSignUp