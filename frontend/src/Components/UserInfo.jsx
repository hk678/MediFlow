import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import '../Style/Userinfo.css';
import axios from "axios";


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
        password: user.password || '',
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

  //사용자 정보 수정----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('사용자 정보:', formData);
    try {
      const response = await axios.put(
        `http://localhost:8081/api/admin/users/${formData.userId}`,
        formData
      );

      console.log("수정된거:", response.data);
      alert("수정 되었습니다.")
      if (onClose) onClose(true); // 수정됨을 알림
    } catch (err) {
      console.error("오류 : ", err)
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };
  // 수정 끝---------

  // 삭제 시작----------

  const handleDelelte = async (e) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/admin/users/${formData.userId}`);
      alert('삭제되었습니다.')
      if (onClose) onClose(true);
    } catch (err) {
      console.log("삭제 실패 : ", err)
      alert("삭제 실패패")
    }

  }















  //- 삭제 끗





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
                  value="관리자"
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
          <button className="submit-button-del" onClick={handleDelelte}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
