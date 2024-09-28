// src/components/Profile.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Spin, Card } from 'antd';

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    isAuthenticated && (
      <div style={{ display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh', 
        textAlign: 'center',
        paddingTop: '20px'}}>
        <h1>Welcome {user.name} to Your Profile!</h1>
      <Card style={{ width: 300, margin: 'auto', marginTop: '20px', marginBottom: '10px'}}>
        <h2>Profile</h2>
        <img src={user.picture} alt={user.name} style={{ borderRadius: '50%', width: 100 }} />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </Card>
      </div>
    )
  );
}

export default Profile;
