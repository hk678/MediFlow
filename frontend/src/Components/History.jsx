import React, { useState,useEffect } from "react";
import { X } from "lucide-react";
import '../Style/History.css';
import axios from "axios";

export default function History({ patient, onClose }) {
  const [inputValue, setInputValue] = useState('');
  // 조회회
  const [history, setHistory] = useState([]);
  //조회끝끝
  const patientName = patient.name;
  const patientPid = patient.pid;

  //조회불러오기 시작
  const fetchHistory = () => {
    axios.get(`http://localhost:8081/api/visits/${patient.visitId}/history`)
      .then((res)=> {
        console.log("history보기 :", res.data)
        console.log("💡 현재 환자 visitId:", patient.visitId);
      })
  }

  useEffect(()=>{
    fetchHistory();
  }, [])

  // 조회 불러오기 끗끗

  const historyEntries = [
    { id: 1, date: "2025-05-28 00:00:00", description: "혈압 호흡 회복중" },
    { id: 2, date: "2025-05-28 00:00:00", description: "환자 의식 잃어서 대처" },
    { id: 3, date: "2025-05-28 00:00:00", description: "혈압, 호흡 회복중" },
  ];

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

        {/* ✅ 상단: 이름 + X버튼을 같은 줄에 배치 */}
        <div className="modal-header">
          <div className="modal-title-container">
            <span className="patient-name">{patientName}</span>
            <span className="patient-id">[{patientPid}]</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <X className="close-icon1" />
          </button>
        </div>


        <div className="history-container">
          {historyEntries.map((entry) => (
            <div key={entry.id} className="history-entry">
              <div className="history-info">
                <span className="history-date">{entry.date}</span>
                <span className="history-description">{entry.description}</span>
              </div>
              <div className="history-buttons">
                <button className="history-button"><span className="history-button-text">수정</span></button>
                <button className="history-button"><span className="history-button-text">삭제</span></button>
              </div>
            </div>
          ))}
        </div>

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
            <button className="register-button" onClick={handleRegister}>
              <span className="register-button-text">등록</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
