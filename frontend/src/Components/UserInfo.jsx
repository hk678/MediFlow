import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import '../Style/Userinfo.css';

export default function UserInfo({ user, onClose }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    userName: '',
    userRole: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId || '',
        password: '',
        userName: user.userName || '',
        userRole: user.userRole || ''
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

  const handleRoleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      userRole: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('사용자 정보:', formData);
  };

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
              name="userId"
              className="input-field"
              value={formData.userId}
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
              name="userName"
              className="input-field"
              placeholder="이름을 입력해주세요"
              value={formData.userName}
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
                  name="userRole"
                  value="의사"
                  className="radio-input"
                  checked={formData.userRole === "의사"}
                  onChange={handleInputChange}
                />
                <label htmlFor="doctor" className="radio-label">의사</label>
              </div>

              <div className="radio-item">
                <input
                  type="radio"
                  id="nurse"
                  name="userRole"
                  value="간호사"
                  className="radio-input"
                  checked={formData.userRole === "간호사"}
                  onChange={handleInputChange}
                />
                <label htmlFor="nurse" className="radio-label">간호사</label>
              </div>

              <div className="radio-item">
                <input
                  type="radio"
                  id="other"
                  name="userRole"
                  value="기타"
                  className="radio-input"
                  checked={formData.userRole === "관리자"}
                  onChange={handleInputChange}
                />
                <label htmlFor="other" className="radio-label">관리자</label>
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
