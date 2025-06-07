import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import '../Style/Userinfo.css';

// user, onClose 받아오기기
export default function UserInfo({ user, onClose }) {   
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    name: '',
    position: ''
  });

    // user 정보가 전달되면 formData 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        password: '', // 비밀번호는 빈칸 유지
        name: user.name || '',
        position: user.position || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePositionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      position: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('사용자 정보:', formData);
  };

    //  닫기 버튼 클릭 시 부모에서 넘긴 함수 호출
  const handleClose = () => {
    if (onClose) onClose();
  };




  return (
    <div className="user-info-modal">
      <div className="user-info-content">
        <div className="user-info-header">
          <h2 className="user-info-title">사용자 정보</h2>
          <button className="close-button" onClick={handleClose}>
            <X className="close-icon" />
          </button>
        </div>

        <form className="user-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">ID</label>
            <input
              type="text"
              name="id"
              className="input-field"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">PW</label>
            <input
              type="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="이름을 입력해주세요"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

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
                  checked={formData.position === '의사'}
                  onChange={handlePositionChange}
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
                  checked={formData.position === '간호사'}
                  onChange={handlePositionChange}
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
                  checked={formData.position === '기타'}
                  onChange={handlePositionChange}
                />
                <label htmlFor="other" className="radio-label">기타</label>
              </div>
            </div>
          </div>
        </form>

        <div className="button-container">
          <button className="submit-button" onClick={handleSubmit}>
            수정
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}