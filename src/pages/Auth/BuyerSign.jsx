import React, { useState } from 'react'
import './Auth.css';
import useSignUp from '../../Hooks/useSignUp'
import { Inner } from '../../commons';
import { SIbc01, SIbc02 } from '../../assets';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function BuyerSign() {
  
  const navigate = useNavigate();
  const { registerUser, isLoading, error, success } = useSignUp();

  const [BuyerValues, setBuyerValues] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Buyer',
  });

  const handleChange = (e) => {
    setBuyerValues({...BuyerValues, [e.target.name]
      : e.target.value
    });
  }
  const handleSignup = async (e) => {
    e.preventDefault();
    await registerUser(BuyerValues);
  };

  return (
    <div>BuyerSign</div>
  )
}

export default BuyerSign