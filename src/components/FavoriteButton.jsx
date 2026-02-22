import React, { useState, useEffect, useCallback } from "react";
import "./FavoriteButton.css";

function FavoriteButton({ post }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const checkIfFavorite = useCallback(() => {
    const saved = localStorage.getItem("favoritePosts");
    if (saved) {
      const favorites = JSON.parse(saved);
      const exists = favorites.some(fav => fav.id === post.id);
      setIsFavorite(exists);
    }
  }, [post.id]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem("favoritePosts");
    let favorites = saved ? JSON.parse(saved) : [];

    if (isFavorite) {
      favorites = favorites.filter(fav => fav.id !== post.id);
      setIsFavorite(false);
    } else {
      const featuredImage = 
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
        post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
        post.jetpack_featured_media_url || 
        post.featured_media_url ||
        post.better_featured_image?.source_url ||
        'https://via.placeholder.com/400x250';

      favorites.push({
        id: post.id,
        title: post.title?.rendered || post.title || 'بدون عنوان',
        excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '').substring(0, 100) || 
                 post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 100) || 
                 '',
        image: featuredImage,
        date: post.date
      });
      setIsFavorite(true);
      
      console.log('Saved post:', {
        id: post.id,
        title: post.title?.rendered,
        image: featuredImage
      });
    }

    localStorage.setItem("favoritePosts", JSON.stringify(favorites));
  };

  return (
    <button 
      className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
      onClick={toggleFavorite}
      title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
    >
      {isFavorite ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )}
    </button>
  );
}

export default FavoriteButton;
