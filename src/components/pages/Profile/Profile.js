// src/components/Profile.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Spin, Card } from 'antd';
import '../../../styles/Profile.less';

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log(user);
  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    isAuthenticated && (
      <div className = 'auth'>
        <h1>Welcome {user.nickname} to Your Profile!</h1>
      <Card className = 'card'>
        <h2>Profile</h2>
        <img className = 'card-img' src={user.picture} alt={user.name} />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </Card>
      </div>
    )
  );
}

export default Profile;
