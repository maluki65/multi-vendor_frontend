import React, { useState } from 'react'
import './Auth.css';
import useSignUp from '../../Hooks/useSignUp'
import { Inner } from '../../commons';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function VendorSign() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const [VendorValues, setVendorValues] = useState({
    storeName: '',
    email: '',
    password: '',
    role: 'Vendor',
  });

  const handleChange = (e) => {
    setVendorValues({...VendorValues, [e.target.name]
      : e.target.value
    });
  }
  const handleSignup = async (e) => {
    e.preventDefault();
    await registerUser(VendorValues);
  };
  const navigate = useNavigate();
  const { registerUser, isLoading, error, success } = useSignUp();
  return (
    <div>VendorSign</div>
  )
}

export default VendorSign