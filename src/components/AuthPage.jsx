// src/components/AuthPage.jsx
import React, { useState, useEffect } from "react";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

const WP_API_URL = "https://hvali.host.webr.ir/wordpress";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("wpToken");
    const savedUsername = localStorage.getItem("wpUsername");
    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/jwt-auth/v1/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.code);
        
        if (
          data.code === "[jwt_auth] invalid_username" ||
          data.code === "[jwt_auth] incorrect_password" ||
          data.code === "[jwt_auth] jwt_auth_failed" ||
          data.code === "[jwt_auth] invalid_credentials"
        ) {
          setError("یوزرنیم یا رمز عبور اشتباه است.");
        } else {
          setError("خطا در ورود به حساب.");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("wpToken", data.token);
      localStorage.setItem("wpUsername", data.user_nicename || username);

      setSuccessMessage("ورود موفقیت‌آمیز بود! در حال انتقال...");
      setLoading(false);

      setTimeout(() => {
        setIsLoggedIn(true);
        navigate("/");
      }, 5000);

    } catch (err) {
      setError("ارتباط با سرور ممکن نیست.");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "خطا در ثبت‌نام.");
        setLoading(false);
        return;
      }

      setSuccessMessage("ثبت‌نام با موفقیت انجام شد، حالا می‌توانی لاگین کنی.");
      setMode("login");
      setPassword("");
      setLoading(false);
    } catch (err) {
      setError("ارتباط با سرور ممکن نیست.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("wpToken");
    localStorage.removeItem("wpUsername");
    setPassword("");
  };

  if (isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <h2>خوش اومدی {username}</h2>
        <button onClick={handleLogout}>خروج</button>
      </div>
    );
  }

return (
  <div className="auth-wrapper">
    <div className="auth-tabs">
      <button
        onClick={() => {
          if (loading) return;
          setMode("login");
          setError("");
          setSuccessMessage("");
        }}
        className={mode === "login" ? "active" : ""}
      >
        ورود
      </button>
      <button
        onClick={() => {
          if (loading) return;
          setMode("register");
          setError("");
          setSuccessMessage("");
        }}
        className={mode === "register" ? "active" : ""}
      >
        ثبت‌نام
      </button>
    </div>

    {mode === "register" ? (
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="یوزرنیم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="رمز"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {error && <p className="auth-error">{error}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>
    ) : (
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          placeholder="یوزرنیم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="رمز"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {error && <p className="auth-error">{error}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    )}
  </div>
);

}

export default AuthPage;
