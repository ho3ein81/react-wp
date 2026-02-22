// src/components/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { Search } from "lucide-react";

const WP_API_URL = "https://hvali.host.webr.ir/wordpress";

function Header({ theme, toggleTheme }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 400);
  }, [query]);

  const performSearch = useCallback(async (term) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${WP_API_URL}/wp-json/wp/v2/posts?search=${encodeURIComponent(
          term
        )}&per_page=5&_embed`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch (err) {
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResultClick = useCallback((id) => {
    setShowResults(false);
    setQuery("");
    navigate(`/post/${id}`);
  }, [navigate]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="header-logo-span">Hvali</span> News
        </Link>

        <button
          className="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          title={theme === "light" ? "دارک مود" : "لایت مود"}
        >
          {theme === "light" ? (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
            </svg>
          ) : (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

        <div className="header-search-wrapper" ref={wrapperRef}>
          <Search className="header-search-icon" size={18} strokeWidth={2} />
          
          <input
            type="text"
            className="header-search-input"
            placeholder="جستجو بین خبرها..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
          />
          
          {loading && <span className="header-search-loading">...</span>}

          {showResults && results.length > 0 && (
            <div className="header-search-results">
              {results.map((post) => {
                const title = post.title?.rendered || "بدون عنوان";
                const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

                return (
                  <button
                    key={post.id}
                    type="button"
                    className="header-search-item"
                    onClick={() => handleResultClick(post.id)}
                  >
                    {featured && (
                      <img
                        src={featured}
                        alt={title}
                        className="header-search-thumb"
                      />
                    )}
                    <div className="header-search-texts">
                      <span
                        className="header-search-title"
                        dangerouslySetInnerHTML={{ __html: title }}
                      />
                      <span className="header-search-meta">
                        {new Date(post.date).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {showResults && !loading && results.length === 0 && (
            <div className="header-search-results">
              <div className="header-search-empty">
                نتیجه‌ای یافت نشد.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
