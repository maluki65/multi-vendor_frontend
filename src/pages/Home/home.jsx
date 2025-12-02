import React from 'react'
import './home.css';
import { useNavigate } from 'react-router-dom';
import { Inner } from '../../commons';
import { Navabar } from '../../components';

function home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/contact')
  }

  return (
    <Inner>
      <Navabar/>
    </Inner>
  )
}

export default home