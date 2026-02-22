// src/pages/AboutPage.jsx - آپدیت شده با متن شما
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import { 
  Code2, 
  Heart, 
  Zap, 
  Shield, 
  MessageCircle, 
  Star,
  Users 
} from 'lucide-react';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            Hvali News درباره
          </h1>
          <p className="about-hero-text">
            Hvali News یه وبسایت اخبار و بلاگ ساده‌ست که کاربرا می‌تونن خبر بخونن، پست بذارن، 
            علاقه‌مندی ذخیره کنن و با چت‌بات حرف بزنن. وردپرس فقط محتوا رو نگه می‌داره، 
            ری اکت هم صفحه‌ها رو می‌سازه.
          </p>
        </div>
      </section>

   
      <section className="about-tech">
        <div className="container">
          <h2 className="section-title">تکنولوژی‌های اصلی</h2>
          
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-logo react">React 19</div>
              <p>صفحه‌های SPA بدون refresh<br/><small>سرعت بالا، حس Native App</small></p>
            </div>
            
            <div className="tech-item">
              <div className="tech-logo cra">CRA</div>
              <p>Create React App<br/><small>راه‌اندازی سریع بدون config پیچیده</small></p>
            </div>
            
            <div className="tech-item">
              <div className="tech-logo wordpress">WP API</div>
              <p>WordPress REST API<br/><small>دریافت پست‌ها، کاربران، آمار</small></p>
            </div>
            
            <div className="tech-item">
              <div className="tech-logo jwt">JWT</div>
              <p>JWT Authentication<br/><small>ورود/خروج امن کاربران</small></p>
            </div>
            
            <div className="tech-item">
              <div className="tech-logo css">CSS</div>
              <p>CSS Modules + Custom CSS<br/><small>استایل تمیز و scoped</small></p>
            </div>
            
          
          </div>
        </div>
      </section>

     
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>شروع کن!</h2>
            <div className="cta-buttons">
              <Link to="/auth" className="cta-btn primary">
                <Star size={20} /> ثبت‌نام
              </Link>
              <Link to="/" className="cta-btn secondary">
                اخبار رو بخون
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
