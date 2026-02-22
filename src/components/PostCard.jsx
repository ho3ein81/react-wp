import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import './PostCard.css';

function PostCard({ post }) {
  const _featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                        post.jetpack_featured_media_url || 
                        'https://via.placeholder.com/400x250';

  const title = post.title?.rendered || 'بدون عنوان';
  const _excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) || '';

  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`} className="post-card-link">
        <img src={_featuredImage} alt={title} className="post-card-image" />
        <div className="post-card-content">
          <h3 className="post-card-title" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </Link>
      
      <FavoriteButton post={post} />
    </div>
  );
}

export default PostCard;
