// src/pages/MyPosts.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyPosts.css";
import Loader from "./Loader";

const WP_API_URL = "https://hvali.host.webr.ir/wordpress";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageId, setFeaturedImageId] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("wpToken");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchMyPosts(token);
  }, [navigate]);

  const fetchMyPosts = async (token) => {
    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/my-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("خطا در دریافت نوشته‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e) => {
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

    setFeaturedImage(file);
    setImagePreview(URL.createObjectURL(file));

    // آپلود فوری عکس
    setUploadingImage(true);
    const token = localStorage.getItem("wpToken");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `${WP_API_URL}/wp-json/hth/v1/upload-image`,
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
        setFeaturedImageId(data.attachment_id);
      } else {
        alert(data.message || "خطا در آپلود عکس");
        setFeaturedImage(null);
        setImagePreview("");
      }
    } catch (err) {
      alert("خطا در آپلود عکس");
      setFeaturedImage(null);
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("wpToken");

    try {
      const response = await fetch(`${WP_API_URL}/wp-json/hth/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          featured_image_id: featuredImageId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("نوشته با موفقیت ایجاد شد!");
        setTitle("");
        setContent("");
        setExcerpt("");
        setFeaturedImage(null);
        setFeaturedImageId(0);
        setImagePreview("");
        setShowForm(false);
        fetchMyPosts(token);
      } else {
        alert(data.message || "خطا در ایجاد نوشته");
      }
    } catch (err) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (
      !window.confirm(
        "آیا مطمئن هستید که می‌خواهید این نوشته را حذف کنید?"
      )
    ) {
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
        setPosts(posts.filter((post) => post.id !== postId));
        alert("نوشته حذف شد.");
      } else {
        alert(data.message || "خطا در حذف نوشته");
      }
    } catch (err) {
      alert("خطا در ارتباط با سرور");
    }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="my-posts-page">
      <div className="my-posts-header">
        <h1>نوشته‌های من</h1>
        <button
          className="my-posts-create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "بستن فرم" : "+ نوشته جدید"}
        </button>
      </div>

      {showForm && (
        <form className="my-posts-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="عنوان نوشته"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
          <textarea
            placeholder="خلاصه (اختیاری)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows="3"
            disabled={submitting}
          />
          <textarea
            placeholder="محتوای نوشته"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            required
            disabled={submitting}
          />

          <div className="my-posts-image-upload">
            <button
              type="button"
              className="my-posts-image-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage || submitting}
            >
              {uploadingImage
                ? "در حال آپلود..."
                : imagePreview
                ? "تغییر عکس شاخص"
                : "+ افزودن عکس شاخص"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
            {imagePreview && (
              <div className="my-posts-image-preview">
                <img src={imagePreview} alt="پیش‌نمایش" />
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting || uploadingImage}>
            {submitting ? "در حال ارسال..." : "انتشار نوشته"}
          </button>
        </form>
      )}

      <div className="my-posts-list">
        {posts.length === 0 ? (
          <p className="my-posts-empty">هنوز نوشته‌ای ایجاد نکرده‌اید.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="my-post-card">
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="my-post-image"
                />
              )}
              <div className="my-post-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="my-post-date">{post.date}</span>
              </div>
              <div className="my-post-actions">
                <Link to={post.link} className="my-post-view-btn">
                  مشاهده
                </Link>
                <button
                  className="my-post-delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPosts;
