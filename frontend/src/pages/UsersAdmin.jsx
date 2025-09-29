import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const { user: me, updateUser } = useAuth();

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (id, role) => {
    const res = await api.put(`/users/${id}/role`, { role });
    if (res.data) {
      setUsers(u => u.map(x => x.id === id ? res.data : x));
      if (me.id === id) updateUser(res.data);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete user?')) return;
    await api.delete(`/users/${id}`);
    setUsers(u => u.filter(x => x.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Users (admin)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                  <option value="read-only">read-only</option>
                </select>
              </td>
              <td><button onClick={() => deleteUser(u.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
