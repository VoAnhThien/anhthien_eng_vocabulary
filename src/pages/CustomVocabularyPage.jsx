// src/pages/CustomVocabularyPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Play, Star } from 'lucide-react';
import '../styles/CustomVocabulary.css';

const CustomVocabularyPage = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [vietnamese, setVietnamese] = useState('');
  const [english, setEnglish] = useState('');
  const [setName, setSetName] = useState('Bộ từ của tôi');
  const [savedSets, setSavedSets] = useState({});

  // Load saved sets từ localStorage khi component mount
  useEffect(() => {
    const saved = localStorage.getItem('custom_vocab_sets');
    if (saved) {
      setSavedSets(JSON.parse(saved));
    }
  }, []);

  const handleAddWord = () => {
    if (vietnamese.trim() && english.trim()) {
      setWords([...words, {
        vi: vietnamese.trim(),
        en: english.trim(),
        id: Date.now() + Math.random()
      }]);
      setVietnamese('');
      setEnglish('');
    }
  };

  const handleDeleteWord = (id) => {
    setWords(words.filter(word => word.id !== id));
  };

  const handleSave = () => {
    if (words.length === 0) {
      alert('Vui lòng thêm ít nhất một từ để lưu!');
      return;
    }

    if (!setName.trim()) {
      alert('Vui lòng nhập tên bộ từ!');
      return;
    }

    const customData = {
      setName,
      words,
      createdAt: new Date().toISOString(),
      wordCount: words.length
    };
    
    // Lưu vào localStorage
    const updatedSets = { ...savedSets, [setName]: customData };
    localStorage.setItem('custom_vocab_sets', JSON.stringify(updatedSets));
    setSavedSets(updatedSets);
    
    alert('Đã lưu bộ từ thành công!');
  };

  const handleLoadSet = (setName) => {
    const setToLoad = savedSets[setName];
    if (setToLoad) {
      setWords(setToLoad.words);
      setSetName(setName);
      alert(`Đã tải bộ từ "${setName}" với ${setToLoad.words.length} từ`);
    }
  };

  const handleDeleteSet = (setNameToDelete, e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa bộ từ "${setNameToDelete}"?`)) {
      const updatedSets = { ...savedSets };
      delete updatedSets[setNameToDelete];
      localStorage.setItem('custom_vocab_sets', JSON.stringify(updatedSets));
      setSavedSets(updatedSets);
      
      // Nếu đang xem set bị xóa, reset form
      if (setName === setNameToDelete) {
        setWords([]);
        setSetName('Bộ từ của tôi');
      }
    }
  };

  const handleStartGame = () => {
    if (words.length === 0) {
      alert('Vui lòng thêm ít nhất một từ để bắt đầu học!');
      return;
    }
    
    if (!setName.trim()) {
      alert('Vui lòng nhập tên bộ từ!');
      return;
    }
    // Lưu bộ từ hiện tại vào sessionStorage để sử dụng trong trang GamePage
    sessionStorage.setItem('current_custom_set', JSON.stringify({
      setName,
      words
    }));
    
    navigate(`/game/custom/${encodeURIComponent(setName)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && vietnamese && english) {
      handleAddWord();
    }
  };

  return (
    <div className="custom-container">
      <div className="custom-wrapper">
        {/* Header */}
        <div className="custom-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={24} />
            <span>Trang chủ</span>
          </button>
          
          <div className="custom-header-content">
            <h1 className="custom-title">Tạo bộ từ của riêng bạn</h1>
            <p className="custom-subtitle">Thêm từ vựng bạn muốn học và lưu để sử dụng sau</p>
          </div>
        </div>

        <div className="custom-content">
          {/* Left Column - Create New Set */}
          <div className="create-set-section">
            {/* Set Name Input */}
            <div className="set-name-section">
              <label className="section-label">
                <Star size={18} />
                Tên bộ từ
              </label>
              <input
                type="text"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="Nhập tên bộ từ của bạn..."
                className="set-name-input"
              />
            </div>

            {/* Add Word Form */}
            <div className="add-word-form">
              <h3 className="section-title">Thêm từ mới</h3>
              <div className="input-row">
                <div className="input-group">
                  <label>Tiếng Việt</label>
                  <input
                    type="text"
                    value={vietnamese}
                    onChange={(e) => setVietnamese(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ví dụ: Xe hơi"
                    className="word-input"
                  />
                </div>
                
                <div className="input-group">
                  <label>Tiếng Anh</label>
                  <input
                    type="text"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ví dụ: Car"
                    className="word-input"
                  />
                </div>
                
                <button 
                  onClick={handleAddWord}
                  disabled={!vietnamese.trim() || !english.trim()}
                  className="add-button"
                >
                  <Plus size={20} />
                  Thêm
                </button>
              </div>
            </div>

            {/* Word List */}
            <div className="word-list-section">
              <div className="section-header">
                <h3>Danh sách từ vựng</h3>
                <span className="word-count">{words.length} từ</span>
              </div>
              
              {words.length === 0 ? (
                <div className="empty-state">
                  <p> Chưa có từ nào. Hãy thêm từ để bắt đầu!</p>
                </div>
              ) : (
                <div className="word-list">
                  {words.map((word, index) => (
                    <div key={word.id} className="word-item">
                      <div className="word-number">#{index + 1}</div>
                      
                      <div className="word-content">
                        <div className="word-vi">
                          <span className="word-label">VI:</span> {word.vi}
                        </div>
                        <div className="word-en">
                          <span className="word-label">EN:</span> {word.en}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteWord(word.id)}
                        className="delete-word-button"
                        title="Xóa từ này"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={handleSave}
                disabled={words.length === 0}
                className="save-button"
              >
                <Save size={20} />
                Lưu bộ từ
              </button>
              
              <button 
                onClick={handleStartGame}
                disabled={words.length === 0}
                className="start-game-button"
              >
                <Play size={20} />
                Bắt đầu học
              </button>
            </div>
          </div>

          {/* Right Column - Saved Sets */}
          <div className="saved-sets-section">
            <h3 className="section-title">
              <Star size={20} />
              Bộ từ đã lưu
            </h3>
            
            {Object.keys(savedSets).length === 0 ? (
              <div className="empty-saved">
                <p> Chưa có bộ từ nào được lưu</p>
                <p className="hint">Lưu bộ từ để xuất hiện ở đây</p>
              </div>
            ) : (
              <div className="saved-sets-list">
                {Object.entries(savedSets).map(([name, data]) => (
                  <div 
                    key={name}
                    className="saved-set-item"
                    onClick={() => handleLoadSet(name)}
                  >
                    <div className="set-info">
                      <h4 className="set-name">{name}</h4>
                      <p className="set-meta">
                        {data.words?.length || data.wordCount} từ • 
                        {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    
                    <div className="set-actions">
                      <button 
                        className="play-set-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWords(data.words || []);
                          setSetName(name);
                          alert(`Đã tải bộ từ "${name}"`);
                        }}
                      >
                        Tải
                      </button>
                      <button 
                        className="delete-set-button"
                        onClick={(e) => handleDeleteSet(name, e)}
                        title="Xóa bộ từ này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVocabularyPage;