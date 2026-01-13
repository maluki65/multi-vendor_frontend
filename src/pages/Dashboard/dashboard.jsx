import React from 'react';
import './dashboard.css';
import { useSearchParams } from "react-router-dom";
import { useAuth } from '../../Context/AuthContext';
import { DashboardLayout, Overview } from '../../components';

function dashboard() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab')|| 'overview';
  const  { userData } = useAuth();

  const user = {
    fullName: userData.username || userData.storename,
    role: userData.role,
    email: userData.email
  }

  return (
    <DashboardLayout fullName={user.fullName} role={user.role} email={user.email}>
      { tab === 'overview' && <Overview/> }
    </DashboardLayout>
  )
}

export default dashboard