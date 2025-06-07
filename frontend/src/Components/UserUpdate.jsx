import React, { useState } from "react";
import { X } from "lucide-react";
import '../Style/userupdate.css';

// 부모(Admin.jsx)로부터 onClose 함수 받기
export default function UserUpdate({ onClose }) {
  
const handleSave = () => {
  console.log("ID:", userData.id);
  console.log("PW:", userData.password);
  console.log("Name:", userData.name);
  console.log("Position:", userData.position);
  handleClose(); // 👉 저장 후 모달 닫기
};



  // 사용자 정보 (입력 가능)
  const [userData, setUserData] = useState({
    id: '',
    password: '',
    name: '',
    position: ''
  });




  const handleClose = () => {
    onClose();
  };

  return (
    <div className="user-info-modal">
      <div className="user-info-content">

        {/* 헤더 */}
        <div className="user-info-header">
          <h2 className="user-info-title">사용자 정보</h2>
          <button className="close-button" onClick={handleClose}>
            <X className="close-icon" />
          </button>
        </div>

        {/* 정보 표시 영역 */}
        <div className="user-form">
          {/* ID 입력 */}
          <div className="input-group">
            <label className="input-label">ID</label>
            <input
              type="text"
              className="user-data"
              value={userData.id}
              onChange={(e) => setUserData({ ...userData, id: e.target.value })}
            />
          </div>

          {/* PW 입력 */}
          <div className="input-group">
            <label className="input-label">PW</label>
            <input
              type="password"
              className="user-data"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
          </div>

          {/* Name 입력 */}
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              className="user-data"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>

          {/* Position 선택 */}
          <div className="input-group">
            <label className="input-label">Position</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="doctor"
                  name="position"
                  value="의사"
                  className="radio-input"
                  checked={userData.position === '의사'}
                  onChange={(e) => setUserData({ ...userData, position: e.target.value })}
                />
                <label htmlFor="doctor" className="radio-label">의사</label>
              </div>

              <div className="radio-item">
                <input
                  type="radio"
                  id="nurse"
                  name="position"
                  value="간호사"
                  className="radio-input"
                  checked={userData.position === '간호사'}
                  onChange={(e) => setUserData({ ...userData, position: e.target.value })}
                />
                <label htmlFor="nurse" className="radio-label">간호사</label>
              </div>

              <div className="radio-item">
                <input
                  type="radio"
                  id="other"
                  name="position"
                  value="기타"
                  className="radio-input"
                  checked={userData.position === '기타'}
                  onChange={(e) => setUserData({ ...userData, position: e.target.value })}
                />
                <label htmlFor="other" className="radio-label">기타</label>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="button-container">
          <button className="submit-button" onClick={handleSave}>저장</button>
        </div>

      </div>
    </div>
  );
}
