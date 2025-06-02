import React, { useState } from "react";
import { X } from "lucide-react";
import '../Style/history.css';

export default function History() {
  const [inputValue, setInputValue] = useState('');

  // Data for history entries
  const historyEntries = [
    {
      id: 1,
      date: "2025-05-28 00:00:00",
      description: "혈압 호흡 회복중",
    },
    {
      id: 2,
      date: "2025-05-28 00:00:00",
      description: "환자 의식 잃어서 대처",
    },
    {
      id: 3,
      date: "2025-05-28 00:00:00",
      description: "혈압, 호흡 회복중",
    },
  ];

  const handleEdit = (id) => {
    console.log('Edit entry:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete entry:', id);
  };

  const handleRegister = () => {
    if (inputValue.trim()) {
      console.log('Register new entry:', inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="patient-modal">
      <div className="patient-modal-content">
        {/* Header */}
        <div className="modal-header">
          <div className="patient-info">
            <span className="patient-name">길복자</span>
            <span className="patient-id">[ 1001 ]</span>
          </div>
          <button className="close-button">
            <X className="close-icon" />
          </button>
        </div>

        {/* History entries */}
        <div className="history-container">
          {historyEntries.map((entry) => (
            <div key={entry.id} className="history-entry">
              <div className="history-info">
                <span className="history-date">{entry.date}</span>
                <span className="history-description">{entry.description}</span>
              </div>
              <div className="history-buttons">
                <button 
                  className="history-button"
                  onClick={() => handleEdit(entry.id)}
                >
                  <span className="history-button-text">수정</span>
                </button>
                <button 
                  className="history-button"
                  onClick={() => handleDelete(entry.id)}
                >
                  <span className="history-button-text">삭제</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Register section at bottom */}
        <div className="register-section">
          <div className="input-container">
            <input 
              type="text" 
              className="input-field"
              placeholder="메모를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="register-button"
              onClick={handleRegister}
            >
              <span className="register-button-text">등록</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}