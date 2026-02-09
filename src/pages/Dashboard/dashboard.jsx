import React from 'react';
import './dashboard.css';
import { useSearchParams } from "react-router-dom";
import { useCurrentUser } from '../../Hooks/useCurrentUser';
import { getUserProfileByRole, needsProfile } from '../../utils/userProfiles';
import { useAuth } from '../../Context/AuthContext';
import { DashboardLayout, Overview, AddAdmin, Users, ProfileForm } from '../../components';

function dashboard() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab')|| 'overview';
  const  { userData } = useAuth();

  const { data: me, isLoading } = useCurrentUser();
  
  if (isLoading) return <p>Loading...</p>

  const profile = getUserProfileByRole(me);
  const showProfileForm = needsProfile(me);

  const user = {
    fullName: userData.username || userData.storename,
    role: userData.role,
    email: userData.email
  }

  return (
    <DashboardLayout fullName={user.fullName} role={user.role} email={user.email}>
      {showProfileForm ? (
        <ProfileForm role={me.role}/>
      ): (
        <>
          { tab === 'overview' && <Overview/> }
          { tab === 'Add-admin' && <AddAdmin/>}
          { tab === 'Users' && <Users/>}
        </>
      )}
    </DashboardLayout>
  )
}

export default dashboard