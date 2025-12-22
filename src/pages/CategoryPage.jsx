import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, BookOpen } from 'lucide-react';
import { VOCABULARY_DATA, getCategorySets } from '../data/vocabulary';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [category, setCategory] = useState(null);
  const [completedSets, setCompletedSets] = useState({});

  useEffect(() => {
    // Load category data
    const categoryData = VOCABULARY_DATA[categoryId];
    if (!categoryData) {
      navigate('/');
      return;
    }

    setCategory(categoryData.info);
    setSets(getCategorySets(categoryId));

    // Load progress from localStorage
    const savedProgress = localStorage.getItem('vocab_progress');
    if (savedProgress) {
      setCompletedSets(JSON.parse(savedProgress));
    }
  }, [categoryId, navigate]);

  const handleStartSet = (setName) => {
    navigate(`/game/${categoryId}/${encodeURIComponent(setName)}`);
  };

  if (!category) return null;

  return (
    <div className="category-container">
      <div className="category-wrapper">
        {/* Header */}
        <div className="category-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={24} />
            <span>Trang chủ</span>
          </button>

          <div className="category-info">
            <div className="category-icon-large">{category.icon}</div>
            <h1 className="category-title">{category.title}</h1>
            <p className="category-desc">{category.description}</p>
          </div>
        </div>

        {/* Sets Grid */}
        <div className="sets-grid">
          {sets.map((set, index) => {
            const setKey = `${categoryId}_${set.name}`;
            const isCompleted = completedSets[setKey]?.completed;
            const bestScore = completedSets[setKey]?.score || 0;

            return (
              <div 
                key={set.name}
                className={`set-card ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleStartSet(set.name)}
              >
                <div className="set-header">
                  <div className="set-number">#{index + 1}</div>
                  {isCompleted && (
                    <CheckCircle className="completed-icon" size={24} />
                  )}
                </div>

                <div className="set-content">
                  <h3 className="set-title">{set.name}</h3>
                  
                  <div className="set-stats">
                    <div className="stat">
                      <BookOpen size={18} />
                      <span>{set.count} từ</span>
                    </div>
                    {bestScore > 0 && (
                      <div className="stat score">
                        <span>🏆 {bestScore} điểm</span>
                      </div>
                    )}
                  </div>

                  <button className="play-button">
                    <Play size={20} fill="currentColor" />
                    <span>{isCompleted ? 'Chơi lại' : 'Bắt đầu'}</span>
                  </button>
                </div>

                <div className="set-decoration"></div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="progress-summary">
          <h3> Tiến độ của bạn</h3>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${(Object.values(completedSets).filter(s => 
                  s.completed && Object.keys(VOCABULARY_DATA[categoryId].sets).includes(
                    s.setName?.split('_').pop()
                  )
                ).length / sets.length) * 100}%` 
              }}
            ></div>
          </div>
          <p className="progress-text">
            Đã hoàn thành {Object.values(completedSets).filter(s => 
              s.completed && s.categoryId === categoryId
            ).length} / {sets.length} bộ từ
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;