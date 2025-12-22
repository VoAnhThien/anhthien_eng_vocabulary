import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { VOCABULARY_DATA } from '../data/vocabulary';
import '../styles/GameStyles.css';

const GamePage = () => {
  const { categoryId, setName } = useParams();
  const navigate = useNavigate();
  const decodedSetName = decodeURIComponent(setName);
  
  // Get words from data source
    const words = React.useMemo(() => {
    if (categoryId === 'custom') {
        // Lấy từ sessionStorage cho custom set
        const customSet = sessionStorage.getItem('current_custom_set');
        if (customSet) {
        try {
            const parsed = JSON.parse(customSet);
            // Kiểm tra xem có trùng tên không
            if (parsed.setName === decodedSetName) {
            return parsed.words;
            }
        } catch (e) {
            console.error('Lỗi parse custom set:', e);
        }
        }
        return [];
    }
    return VOCABULARY_DATA[categoryId]?.sets[decodedSetName] || [];
  }, [categoryId, decodedSetName]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [fallingPosition, setFallingPosition] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [isGameOver, setIsGameOver] = useState(false);
  const inputRef = useRef(null);
  const hasHitGroundRef = useRef(false);

  // Debug log
    console.log('Debug Info:', {
    categoryId,
    setName,
    decodedSetName,
    wordsLength: words.length,
    isCustom: categoryId === 'custom',
    sessionData: sessionStorage.getItem('current_custom_set')
    });

  // Animation rơi
  useEffect(() => {
    if (isGameOver || words.length === 0) return;
        hasHitGroundRef.current = false; // Reset flag when word changes
    const interval = setInterval(() => {
      setFallingPosition(prev => {
        if (prev >= 72 && !hasHitGroundRef.current) {
            hasHitGroundRef.current = true; // Mark that we've hit the ground
            clearInterval(interval);
            setGameStatus('wrong');
            setTimeout(() => moveToNextWord(), 1000);
            return 72;
        }
        return prev < 72 ? prev + 0.2 : 72;// tốc độ rơi
      });
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex, isGameOver, words.length]);

  useEffect(() => {
    if (inputRef.current && !isGameOver) {
      inputRef.current.focus();
    }
  }, [currentIndex, isGameOver]);

  const moveToNextWord = () => {
    if (currentIndex + 1 >= words.length) {
      setIsGameOver(true);
      saveProgress();
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setUserInput('');
    setFallingPosition(0);
    setGameStatus('playing');
  };

  const handleSubmit = () => {
    if (isGameOver || !userInput.trim()) return;

    const correctAnswer = words[currentIndex].en.toLowerCase().trim();
    const userAnswer = userInput.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      setGameStatus('correct');
      setScore(prev => prev + 10);
      setTimeout(() => moveToNextWord(), 500);
    } else {
      setGameStatus('wrong');
      setTimeout(() => {
        setGameStatus('playing');
        setUserInput('');
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const saveProgress = () => {
    const savedProgress = JSON.parse(localStorage.getItem('vocab_progress') || '{}');
    const setKey = `${categoryId}_${decodedSetName}`;
    
    const currentBest = savedProgress[setKey]?.score || 0;
    savedProgress[setKey] = {
      categoryId,
      setName: decodedSetName,
      score: Math.max(score, currentBest),
      completed: true,
      lastPlayed: new Date().toISOString()
    };
    
    localStorage.setItem('vocab_progress', JSON.stringify(savedProgress));
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setFallingPosition(0);
    setUserInput('');
    setGameStatus('playing');
    setIsGameOver(false);
  };

  const goBack = () => {
  if (categoryId === 'custom') {
    navigate('/custom');
  } else {
    navigate(`/category/${categoryId}`);
  }
};

  const goHome = () => {
    navigate('/');
  };

  if (words.length === 0) {
    return (
        <div className="game-container">
        <div className="game-wrapper">
            <div className="error-state">
            <h2>Không tìm thấy bộ từ này!</h2>
            <button onClick={goHome} className="home-button">
                Về trang chủ
            </button>
            {categoryId === 'custom' && (
                <button 
                onClick={() => navigate('/custom')} 
                className="custom-button"
                style={{ marginTop: '10px' }}
                >
                Quay lại trang tạo bộ từ
                </button>
            )}
            </div>
        </div>
        </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-wrapper">
        {/* Header */}
        <div className="game-header">
          <button className="icon-button" onClick={goBack} title="Quay lại">
            <ArrowLeft size={24} />
          </button>
          
          <div className="game-title-section">
            <h2 className="game-set-name">{decodedSetName}</h2>
            <div className="game-score">
              <Trophy size={20} />
              <span>{score} điểm</span>
            </div>
          </div>

          <button className="icon-button" onClick={goHome} title="Trang chủ">
            <Home size={24} />
          </button>
        </div>

        {/* Game Area */}
        {!isGameOver ? (
          <div className="game-area">
            {/* Từ rơi */}
            <div
              className="falling-word"
              style={{ 
                top: `${fallingPosition}%`, 
                transition: 'top 30ms linear',
              }}
            >
              <div className={`word-badge ${gameStatus}`}>
                {words[currentIndex]?.vi}
              </div>
            </div>

            {/* Progress */}
            <div className="progress-indicator">
              Từ {currentIndex + 1} / {words.length}
            </div>

            {/* Input area */}
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type the English word..."
                  className={`game-input ${gameStatus}`}
                  disabled={gameStatus !== 'playing'}
                  autoComplete="off"
                />
                <button
                  onClick={handleSubmit}
                  disabled={gameStatus !== 'playing'}
                  className="submit-button"
                >
                  Gửi
                </button>
              </div>
              
              {gameStatus === 'wrong' && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  <span>Đáp án đúng: <b className="correct-text">{words[currentIndex]?.en}</b></span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="game-over">
            <Trophy className="trophy-icon" size={80} />
            <h2 className="game-over-title">Hoàn thành!</h2>
            <p className="score-label">Điểm số của bạn:</p>
            <p className="final-score">{score}</p>
            <p className="max-score">Tối đa: {words.length * 10} điểm</p>
            
            <div className="game-over-buttons">
              <button onClick={resetGame} className="restart-button">
                Chơi lại
              </button>
              <button onClick={goBack} className="back-to-sets-button">
                Chọn bộ khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;