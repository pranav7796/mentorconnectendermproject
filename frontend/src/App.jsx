import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              user ? (
                user.role === 'student' ? (
                  <Navigate to="/student-dashboard" />
                ) : (
                  <Navigate to="/mentor-dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            } />
            
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login setUser={setUser} />
            } />
            
            <Route path="/register" element={
              user ? <Navigate to="/" /> : <Register setUser={setUser} />
            } />
            
            <Route path="/student-dashboard" element={
              user && user.role === 'student' ? (
                <StudentDashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } />
            
            <Route path="/mentor-dashboard" element={
              user && user.role === 'mentor' ? (
                <MentorDashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
