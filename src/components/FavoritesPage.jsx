import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FavoritesPage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem("favoritePosts");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const removeFromFavorites = (postId) => {
    const updated = favorites.filter(post => post.id !== postId);
    setFavorites(updated);
    localStorage.setItem("favoritePosts", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h2 className="favorites-heading">مطالب مورد علاقه</h2>
        <div className="empty-favorites">
          <p>هنوز هیچ مطلبی به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
          <Link to="/" className="back-home-btn">بازگشت به صفحه اصلی</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2 className="favorites-heading">مطالب مورد علاقه ({favorites.length})</h2>
      <div className="favorites-grid">
        {favorites.map((post) => (
          <div key={post.id} className="favorite-card">
            {post.image && (
              <img src={post.image} alt={post.title} className="favorite-image" />
            )}
            
            <div className="favorite-content">
              <h3 className="favorite-title" dangerouslySetInnerHTML={{ __html: post.title }} />
              <p className="favorite-excerpt">{post.excerpt}</p>
            </div>

            <div className="favorite-actions">
              <Link to={`/post/${post.id}`} className="read-btn">
                مطالعه
              </Link>
              <button 
                onClick={() => removeFromFavorites(post.id)}
                className="remove-btn"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
