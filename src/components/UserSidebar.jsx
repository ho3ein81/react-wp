// src/components/UserSidebar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./UserSidebar.css";
import { Link, useNavigate } from "react-router-dom";

const WP_API_URL = "https://hvali.host.webr.ir/wordpress";

function UserSidebar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("wpToken");
  const username = localStorage.getItem("wpUsername") || "Guest";
  const isLoggedIn = Boolean(token);

  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [userPostsCount, setUserPostsCount] = useState(0);

  const ads = [
    {
      image: "https://cdn.dribbble.com/userupload/42508861/file/original-ef6e4789770f14d0f0a207bf86152d32.gif",
      link: "https://dribbble.com"
    },
    {
      image: "http://cdn.prod.website-files.com/6640cd28f51f13175e577c05/678fbd56bb78c2e1390b0951_Series-C-07-1280x720.gif",
      link: "https://example.com"
    },
    {
      image: "https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/5d2099de-0826-45cc-b22c-82352d1f1860/Sequence_1_1.gif?t=1741182627",
      link: "https://beehiiv.com"
    }
  ];

  const fetchProfilePicture = useCallback(async (authToken) => {
    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/profile-picture`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success && data.image_url) {
        setProfilePicture(data.image_url);
      }
    } catch (err) {
      console.error("خطا در دریافت عکس پروفایل:", err);
    }
  }, []);

  const fetchUserPostsCount = useCallback(async (authToken) => {
    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/my-posts`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success && Array.isArray(data.posts)) {
        setUserPostsCount(data.posts.length);
      }
    } catch (err) {
      console.error("خطا در دریافت تعداد نوشته‌های کاربر:", err);
    }
  }, []);

  useEffect(() => {
    fetch(`${WP_API_URL}/wp-json/wp/v2/posts?per_page=1`)
      .then((res) => {
        const total = res.headers.get("X-WP-Total");
        if (total) setTotalPostsCount(parseInt(total, 10));
      })
      .catch(() => {});

    if (isLoggedIn && token) {
      fetchProfilePicture(token);
      fetchUserPostsCount(token);
    }
  }, [isLoggedIn, token, fetchProfilePicture, fetchUserPostsCount]);

  const handleAvatarClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفاً فقط فایل تصویری انتخاب کنید.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم فایل نباید بیشتر از 5 مگابایت باشد.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setProfilePicture(data.image_url);
      } else {
        alert(data.message || "خطا در آپلود عکس");
      }
    } catch (err) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wpToken");
    localStorage.removeItem("wpUsername");
    setProfilePicture("");
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="sidebar-wrapper">
        <aside className="user-sidebar">
          <p className="user-sidebar-title">ورود به حساب</p>
          <p className="user-sidebar-text">
            برای دسترسی به داشبورد و پروفایل، وارد حساب خودت شو.
          </p>
          <Link to="/auth" className="user-sidebar-login-link">
            ورود / ثبت‌نام
          </Link>
        </aside>

        <div className="sidebar-ads-section">
          {ads.map((ad, index) => (
            <div key={index} className="sidebar-ad-item">
              <a href={ad.link} target="_blank" rel="noopener noreferrer">
                <img src={ad.image} alt={`تبلیغ ${index + 1}`} className="sidebar-ad-image" />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-wrapper">
      <aside className="user-sidebar">
        <div className="user-card">
          <div
            className="user-avatar"
            onClick={handleAvatarClick}
            title="کلیک کنید برای تغییر عکس پروفایل"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={username}
                className="user-avatar-img"
              />
            ) : (
              <span className="user-avatar-initial">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
            {uploading && (
              <div className="user-avatar-uploading">
                <span>...</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="user-info-row">
            <div className="user-info">
              <p className="user-name">{username}</p>
              <p className="user-role">عضو سایت</p>
            </div>
            <button className="user-logout-btn" onClick={handleLogout}>
              خروج
            </button>
          </div>
        </div>

        <div className="user-stats">
          <div className="user-stat-item">
            <span className="user-stat-label">تعداد کل خبرها</span>
            <span className="user-stat-value">{totalPostsCount}</span>
          </div>
          <div className="user-stat-item">
            <span className="user-stat-label">خبرهای شما</span>
            <span className="user-stat-value">{userPostsCount}</span>
          </div>
        </div>

        <nav className="user-menu">
          <Link to="/dashboard" className="user-menu-item">
            داشبورد
          </Link>
          <Link to="/favorites" className="user-menu-item">
            علاقه‌مندی‌های من
          </Link>
          <Link to="/my-posts" className="user-menu-item">
            نوشته‌های من
          </Link>
          <Link to="/ai-chat" className="user-menu-item">
            (AI) دستیار شخصی
          </Link>
          <Link to="/about" className="user-menu-item">
   درباره برنامه
</Link>

        </nav>
      </aside>

      <div className="sidebar-ads-section">
        {ads.map((ad, index) => (
          <div key={index} className="sidebar-ad-item">
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <img src={ad.image} alt={`تبلیغ ${index + 1}`} className="sidebar-ad-image" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSidebar;
