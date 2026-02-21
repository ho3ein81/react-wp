// src/components/PostList.jsx
import React, { useEffect, useState } from 'react';
import PostCard from './PostCard.jsx';
import Loader from './Loader.jsx';

const wpUrl = 'https://hvali.host.webr.ir/wordpress';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // اینجا همه پست‌ها را از وردپرس می‌گیریم
    fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=20&_embed`)
      .then((res) => {
        if (!res.ok) throw new Error('Status: ' + res.status);
        return res.json();
      })
      .then((data) => {
         console.log('First post:', data[0]); // 
        setPosts(data);      // تمام پست‌ها اینجاست
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>خطا در لود: {error}</p>;

  return (
    
<div style={{ padding: '20px' }}>
    <h1 style={{ maxWidth: 1100, margin: '0 auto 24px' }}>Blog Page</h1>

    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '20px',
      }}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  </div>
);
}

export default PostList;
