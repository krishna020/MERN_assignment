import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: doRegister } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await doRegister(data);
    if (res.ok) navigate('/dashboard');
    else alert(res.error || 'Register failed');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><label>Name</label><input {...register('name')} /></div>
        <div><label>Email</label><input {...register('email')} /></div>
        <div><label>Password</label><input type="password" {...register('password')} /></div>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
