import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';
import AdminResourcesApp from './pages/AdminResources';
import UserResourcesApp from './pages/UserResources';
import './App.css';

const queryClient = new QueryClient();

function App() {
  // Mock auth - replace with actual OAuth later
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER'
  };

  const adminMock = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN'
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/my-bookings" />} />
            {/* Your Booking Routes */}
            <Route path="/my-bookings" element={<MyBookings user={mockUser} />} />
            <Route path="/admin-bookings" element={<AdminBookings user={adminMock} />} />
            {/* Resource Routes from main */}
            <Route path="/user-resources" element={<UserResourcesApp userName={mockUser.name} userInitial="U" />} />
            <Route path="/admin-resources" element={<AdminResourcesApp adminName={adminMock.name} adminInitial="A" />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;