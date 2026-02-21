// src/App.js - کامل
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PostList from './components/PostList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SinglePost from './components/SinglePost';
import AuthPage from './components/AuthPage';
import UserSidebar from './components/UserSidebar';
import AIChat from './components/AIChat';
import FavoritesPage from './components/FavoritesPage';
import MyPosts from './components/MyPosts';
import Dashboard from './components/Dashboard';
import Footer from "./components/Footer";
import './App.css';

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="app-layout">
                <div className="app-content">
                  <PostList />
                </div>
                <UserSidebar />
              </div>
            }
          />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route
            path="/favorites"
            element={
              <div className="app-layout">
                <div className="app-content">
                  <FavoritesPage />
                </div>
                <UserSidebar />
              </div>
            }
          />
          
          <Route
            path="/my-posts"
            element={
              <div className="app-layout">
                <div className="app-content">
                  <MyPosts />
                </div>
                <UserSidebar />
              </div>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <div className="app-layout">
                <div className="app-content">
                  <Dashboard />
                </div>
                <UserSidebar />
              </div>
            }
          />

          {/* 🔥 AIChat Route */}
          <Route
            path="/ai-chat"
            element={
              <div className="app-layout">
                <div className="app-content">
                  <AIChat />
                </div>
                <UserSidebar />
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
