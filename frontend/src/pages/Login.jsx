import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res.ok) navigate('/dashboard');
    else alert(res.error || 'Login failed');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><label>Email</label><input {...register('email')} /></div>
        <div><label>Password</label><input type="password" {...register('password')} /></div>
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
