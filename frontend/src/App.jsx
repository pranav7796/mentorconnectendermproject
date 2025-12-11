import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboardNew from './pages/StudentDashboardNew';
import MentorDashboardNew from './pages/MentorDashboardNew';
import ChatPage from './pages/ChatPage';
import CodeEditor from './components/code/CodeEditor';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-2xl text-purple-300">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={
              user ? (
                user.role === 'student' ? (
                  <Navigate to="/student-dashboard-new" />
                ) : (
                  <Navigate to="/mentor-dashboard-new" />
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

            <Route path="/student-dashboard-new" element={
              user && user.role === 'student' ? (
                <StudentDashboardNew user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } />

            <Route path="/mentor-dashboard-new" element={
              user && user.role === 'mentor' ? (
                <MentorDashboardNew user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } />

            <Route path="/code-editor" element={
              user ? <CodeEditor /> : <Navigate to="/login" />
            } />

            <Route path="/chat/:userId" element={
              user ? <ChatPage /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
