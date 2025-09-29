import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingFallback from './components/LoadingFallback';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const TransactionForm = lazy(() => import('./pages/TransactionForm'));
const UsersAdmin = lazy(() => import('./pages/UsersAdmin'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/transactions" element={
              <ProtectedRoute><Transactions /></ProtectedRoute>
            } />
            <Route path="/transactions/new" element={
              <ProtectedRoute roles={['admin','user']}><TransactionForm /></ProtectedRoute>
            } />
            <Route path="/transactions/:id/edit" element={
              <ProtectedRoute roles={['admin','user']}><TransactionForm /></ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute roles={['admin']}><UsersAdmin /></ProtectedRoute>
            } />

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div style={{ padding:20 }}>404 - Not Found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
