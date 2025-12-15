import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import useWebSocket from "./hooks/useWebSocket";
import Profile from "./pages/Profile";
import History from "./pages/History";
import { checkSession, logout } from './utils/auth';

import PublicRoute from "./utils/PublicRoute";

function App() {
  useWebSocket();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = checkSession();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center">
        <div className="w-full">
          <Navbar user={user} onLogout={handleLogout} />
        </div>

        <main className="flex-grow w-full flex justify-center">
          <div className="w-full max-w-[1400px] p-6">
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute user={user}>
                    <Login setUser={setUser} />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute user={user}>
                    <Register setUser={setUser} />
                  </PublicRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
