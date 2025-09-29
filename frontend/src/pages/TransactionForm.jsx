import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (id) {
      api.get(`/transactions/${id}`).then(res => {
        reset(res.data);
      }).catch(() => {});
    }
  }, [id, reset]);

  const onSubmit = useCallback(async (data) => {
    try {
      if (id) await api.put(`/transactions/${id}`, data);
      else await api.post('/transactions', data);
      navigate('/transactions');
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  }, [id, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{id ? 'Edit' : 'New'} Transaction</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><label>Date</label><input type="date" {...register('date')} required /></div>
        <div><label>Description</label><input {...register('description')} required /></div>
        <div>
          <label>Category</label>
          <select {...register('category')} required>
            <option value="">--</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Salary</option>
          </select>
        </div>
        <div>
          <label>Type</label>
          <select {...register('type')} required>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div><label>Amount</label><input type="number" step="0.01" {...register('amount')} required /></div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
