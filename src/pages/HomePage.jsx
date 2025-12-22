// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../data/vocabulary';
import { BookOpen, Trophy, Sparkles, PlusCircle } from 'lucide-react';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const categories = getCategories();

  return (
    <div className="home-container">
      <div className="home-wrapper">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">
            <Sparkles size={60} className="sparkle-icon" />
          </div>
          <h1 className="hero-title">
            Học Tiếng Anh<br />
            <span className="hero-subtitle">Qua Game Thú Vị</span>
          </h1>
          <p className="hero-description">
            Chọn bộ từ vựng phù hợp với mục tiêu của bạn và bắt đầu học ngay!
          </p>
        </div>

        {/* Category Cards */}
        <div className="categories-grid">
          {categories.map((category) => {
            // Chọn icon dựa trên category
            let icon;
            if (category.id === 'custom') {
              icon = <PlusCircle size={40} className="text-orange-500" />;
            } else if (category.id === 'TOEIC') {
              icon = <BookOpen size={40} className="text-blue-500" />;
            } else if (category.id === 'IELTS') {
              icon = <Trophy size={40} className="text-purple-500" />;
            } else {
              icon = <Sparkles size={40} className="text-green-500" />;
            }

            return (
              <div
                key={category.id}
                className="category-card"
                onClick={() => {
                  if (category.id === 'custom') {
                    navigate('/custom');
                  } else {
                    navigate(`/category/${category.id}`);
                  }
                }}
              >
                <div className={`card-gradient ${category.color || 'from-orange-500 to-red-500'}`}></div>
                
                <div className="card-content">
                  <div className="card-icon">{icon}</div>
                  <h2 className="card-title">{category.title}</h2>
                  <p className="card-description">{category.description}</p>
                  
                  <div className="card-stats">
                    <div className="stat-item">
                      <BookOpen size={18} />
                      <span>{category.setsCount} bộ từ</span>
                    </div>
                    <div className="stat-item">
                      <Trophy size={18} />
                      <span>{category.totalWords} từ</span>
                    </div>
                  </div>

                  <button className="card-button">
                    {category.id === 'custom' ? 'Tạo ngay' : 'Bắt đầu học'}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3l7 7-7 7-1.4-1.4L13.2 11H3V9h10.2L8.6 4.4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="home-footer">
          <p>Mỗi từ đúng = 10 điểm. Hãy cố gắng đạt điểm cao nhất!</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;