import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
      <Link to="/dashboard">Dashboard</Link>
      {user && <Link to="/transactions">Transactions</Link>}
      {user && <Link to="/analytics">Analytics</Link>}
      {user?.role === 'admin' && <Link to="/users">User Admin</Link>}
      <div style={{ flex: 1 }} />
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <span>Hi, {user.name} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
