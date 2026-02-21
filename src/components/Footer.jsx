// src/components/Footer.jsx
import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  FileText,
  Heart,
  Info,
  Mail
} from "lucide-react";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* ستون برند */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Hvali <span>News</span>
          </Link>
          <p className="footer-text">
            جدیدترین اخبار، تحلیل‌ها و نوشته‌های کاربران در یک فضای ساده و مینیمال.
          </p>
        </div>

        {/* ستون لینک‌های سریع */}
        <div className="footer-column">
          <h4 className="footer-title">دسترسی سریع</h4>

          <Link to="/" className="footer-link">
            <Home size={16} className="footer-icon" />
            صفحه اصلی
          </Link>

          <Link to="/dashboard" className="footer-link">
            <LayoutDashboard size={16} className="footer-icon" />
            داشبورد
          </Link>

          <Link to="/my-posts" className="footer-link">
            <FileText size={16} className="footer-icon" />
            نوشته‌های من
          </Link>

          <Link to="/favorites" className="footer-link">
            <Heart size={16} className="footer-icon" />
            علاقه‌مندی‌ها
          </Link>
        </div>

        {/* ستون درباره / تماس */}
        <div className="footer-column">
          <h4 className="footer-title">
            <Info size={16} className="footer-icon" />
            درباره
          </h4>
          <p className="footer-small-text">
            این وب‌اپ با وردپرس + React ساخته شده و تمرکزش روی تجربه تمیز برای خواندن و نوشتن خبر است.
          </p>
          <a href="mailto:info@example.com" className="footer-link">
            <Mail size={16} className="footer-icon" />
            تماس با ما
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-text">
          © {new Date().getFullYear()} Hvali News. همه حقوق محفوظ است.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
