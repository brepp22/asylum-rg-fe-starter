import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'antd';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      Logout
    </Button>
  ) : (
    <Button onClick={loginWithRedirect}>Login</Button>
  );
};