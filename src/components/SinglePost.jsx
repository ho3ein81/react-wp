// src/components/SinglePost.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SinglePost.css';
import Loader from './Loader';

const wpUrl = 'https://hvali.host.webr.ir/wordpress';

function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${wpUrl}/wp-json/wp/v2/posts/${id}?_embed`)
      .then((res) => {
        if (!res.ok) throw new Error('Status: ' + res.status);
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>خطا در لود: {error}</p>;
  if (!post) return <p>پستی یافت نشد.</p>;

  const _featuredImage =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post.jetpack_featured_media_url ||
    null;

  return (
    <div className="single-post-wrapper">
      <Link to="/" className="single-post-back-link">
        ← بازگشت به لیست پست‌ها
      </Link>

      <h1
        className="single-post-title"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <p className="single-post-meta">
        تاریخ: {new Date(post.date).toLocaleDateString('fa-IR')}
      </p>

      { _featuredImage && (
        <div className="single-post-featured-image">
          <img src={_featuredImage} alt={post.title.rendered} />
        </div>
      )}

      <div
        className="single-post-content"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
}

export default SinglePost;
