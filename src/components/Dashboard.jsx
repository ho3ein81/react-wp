// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Loader from "./Loader";
import { 
  FileText, 
  Heart, 
  Globe, 
  Calendar,
  Plus,
  Home,
  Eye,
  Trash2,
  User,
  Mail,
  Shield,
  Clock
} from "lucide-react";

const WP_API_URL = "https://hvali.host.webr.ir/wordpress";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [stats, setStats] = useState({
    totalPosts: 0,
    favorites: 0,
    totalSitePosts: 0,
    memberSince: "",
  });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("wpToken");
    const savedUsername = localStorage.getItem("wpUsername");

    if (!token) {
      navigate("/auth");
      return;
    }

    setUsername(savedUsername || "کاربر");
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const userResponse = await fetch(
        `${WP_API_URL}/wp-json/wp/v2/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await userResponse.json();
      setUserEmail(userData.email || "");
      setStats((prev) => ({
        ...prev,
        memberSince: new Date(userData.registered_date).toLocaleDateString(
          "fa-IR"
        ),
      }));

      const allPostsResponse = await fetch(
        `${WP_API_URL}/wp-json/wp/v2/posts?per_page=1`
      );
      const totalSitePosts = allPostsResponse.headers.get("X-WP-Total");
      setStats((prev) => ({
        ...prev,
        totalSitePosts: parseInt(totalSitePosts, 10) || 0,
      }));

      const myPostsResponse = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/my-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const myPostsData = await myPostsResponse.json();
      if (myPostsData.success) {
        setStats((prev) => ({
          ...prev,
          totalPosts: myPostsData.posts.length,
        }));
        setRecentPosts(myPostsData.posts.slice(0, 5));
      }

      const favoritesData = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      setStats((prev) => ({
        ...prev,
        favorites: favoritesData.length,
      }));
    } catch (err) {
      console.error("خطا در دریافت اطلاعات داشبورد:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این نوشته را حذف کنید؟")) {
      return;
    }

    const token = localStorage.getItem("wpToken");
    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setRecentPosts(recentPosts.filter((post) => post.id !== postId));
        setStats((prev) => ({
          ...prev,
          totalPosts: prev.totalPosts - 1,
        }));
        alert("نوشته حذف شد.");
      }
    } catch (err) {
      alert("خطا در حذف نوشته");
    }
  };

  if (loading) {
    return <Loader />;
  }

  const today = new Date().toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">خوش آمدید، {username}! 👋</h1>
          <p className="dashboard-date">
            <Clock size={16} style={{ display: "inline", marginLeft: "4px" }} />
            امروز: {today}
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={36} strokeWidth={1.5} />
          </div>
          <div className="stat-info">
            <p className="stat-label">نوشته‌های شما</p>
            <p className="stat-value">{stats.totalPosts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Heart size={36} strokeWidth={1.5} />
          </div>
          <div className="stat-info">
            <p className="stat-label">علاقه‌مندی‌ها</p>
            <p className="stat-value">{stats.favorites}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Globe size={36} strokeWidth={1.5} />
          </div>
          <div className="stat-info">
            <p className="stat-label">کل خبرهای سایت</p>
            <p className="stat-value">{stats.totalSitePosts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={36} strokeWidth={1.5} />
          </div>
          <div className="stat-info">
            <p className="stat-label">عضویت از</p>
            <p className="stat-value-small">{stats.memberSince}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2 className="dashboard-section-title">⚡ اقدامات سریع</h2>
        <div className="action-buttons">
          <Link to="/my-posts" className="action-btn">
            <Plus size={20} strokeWidth={2} />
            نوشته جدید
          </Link>
          <Link to="/favorites" className="action-btn">
            <Heart size={20} strokeWidth={2} />
            علاقه‌مندی‌ها
          </Link>
          <Link to="/" className="action-btn">
            <Home size={20} strokeWidth={2} />
            صفحه اصلی
          </Link>
        </div>
      </div>

      <div className="dashboard-recent">
        <h2 className="dashboard-section-title">
          <FileText size={20} style={{ display: "inline", marginLeft: "8px" }} />
          آخرین نوشته‌های شما
        </h2>
        {recentPosts.length === 0 ? (
          <div className="dashboard-empty">
            <p>هنوز نوشته‌ای ایجاد نکرده‌اید.</p>
            <Link to="/my-posts" className="dashboard-empty-link">
              <Plus size={16} style={{ marginLeft: "4px" }} />
              اولین نوشته خود را بسازید
            </Link>
          </div>
        ) : (
          <div className="recent-posts-list">
            {recentPosts.map((post) => (
              <div key={post.id} className="recent-post-item">
                <div className="recent-post-info">
                  <h3 className="recent-post-title">{post.title}</h3>
                  <p className="recent-post-date">
                    <Clock size={12} style={{ display: "inline", marginLeft: "4px" }} />
                    {post.date}
                  </p>
                </div>
                <div className="recent-post-actions">
                  <Link to={post.link} className="recent-post-btn view-btn">
                    <Eye size={16} strokeWidth={2} />
                    مشاهده
                  </Link>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="recent-post-btn delete-btn"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-summary">
        <h2 className="dashboard-section-title">
          <User size={20} style={{ display: "inline", marginLeft: "8px" }} />
          خلاصه حساب
        </h2>
        <div className="summary-card">
          <div className="summary-item">
            <span className="summary-label">
              <User size={16} style={{ display: "inline", marginLeft: "4px" }} />
              نام کاربری:
            </span>
            <span className="summary-value">{username}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">
              <Mail size={16} style={{ display: "inline", marginLeft: "4px" }} />
              ایمیل:
            </span>
            <span className="summary-value">{userEmail}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">
              <Shield size={16} style={{ display: "inline", marginLeft: "4px" }} />
              نقش:
            </span>
            <span className="summary-value">عضو سایت</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">
              <Calendar size={16} style={{ display: "inline", marginLeft: "4px" }} />
              تاریخ عضویت:
            </span>
            <span className="summary-value">{stats.memberSince}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
