import "../Style/Mainpage.css";  // 공통 헤더/스탯카드 스타일
import "../Style/Admin.css";     // Admin 전용 스타일
import React, { useState } from "react";
import { Search, User, Users, Bed, AlertCircle, AlertTriangle } from 'lucide-react';
import logoutIcon from '../assets/images/logout-icon.png';
import UserUpdate from "./UserUpdate";
import UserInfo from "./UserInfo";

const Admin = () => {
  // 모달 상태 추가
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "update" 또는 "info"

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 선택한 사용자 정보 상태
  const [selectedUser, setSelectedUser] = useState(null);

  // 추가 버튼 클릭 시 모달 열기
  const openUpdateModal = () => {
    setModalType("update");
    setShowModal(true);
  };

  // 이름 클릭 시 정보 모달 열기
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalType("info");
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // 사용자 리스트
  const userList = [
    { id: "124545", name: "이도은", position: "의사", lastLogin: "2025-05-29 11:55:44" },
    { id: "254545", name: "김하늘", position: "간호사", lastLogin: "2025-05-29 11:54:11" },
    { id: "777777", name: "홍길동", position: "기타", lastLogin: "2025-06-02 13:25:17" },
    { id: "124545", name: "이도은", position: "의사", lastLogin: "2025-05-29 11:55:44" },
    { id: "254545", name: "김하늘", position: "간호사", lastLogin: "2025-05-29 11:54:11" },
    { id: "777777", name: "홍길동", position: "기타", lastLogin: "2025-06-02 13:25:17" },
    { id: "254545", name: "김하늘", position: "간호사", lastLogin: "2025-05-29 11:54:11" },
    { id: "777777", name: "홍길동", position: "기타", lastLogin: "2025-06-02 13:25:17" },
  ];

  // 검색어 기반 필터링
  const filteredUsers = userList.filter(
    (user) =>
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="medical-dashboard admin-page">
      <div className="dashboard-content">
        {/* 공통 헤더 스타일 사용 (mainpage.css) */}
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <span className="logo-text">MediFlow</span>
              </div>
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="user-info">
              <User className="user-icon" />
              <span className="user-name">관리자</span>
              <div className="logout-button">
                <img src={logoutIcon} alt="logout" className="logout-icon" />
                <span className="logout-text">Logout</span>
              </div>
            </div>
          </div>
        </div>

        {/* 공통 스탯카드 스타일 사용 (mainpage.css) */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <Users className="stat-icon blue" />
              <div>
                <div className="stat-number blue">15</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <Bed className="stat-icon blue" />
              <div>
                <div className="stat-number blue">8/15</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card stat-card-danger">
            <div className="stat-content">
              <AlertCircle className="stat-icon red" />
              <div className="stat-text">
                <div className="stat-label">관리 대상</div>
                <div className="stat-number red">3</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card stat-card-warning">
            <div className="stat-content">
              <AlertTriangle className="stat-icon yellow" />
              <div className="stat-text">
                <div className="stat-label">신규 가입</div>
                <div className="stat-number yellow">2</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin 전용 영역 - Admin.css 스타일 사용 */}
        <div className="admin-content">
          {/* 그래프 영역 */}
          <div className="admin-graph">
            <p>📊 관리자 통계 그래프</p>
          </div>

          {/* 사용자 관리 테이블 */}
          <div className="admin-table-section">
            <div className="admin-table-header">
              <span>사용자 관리</span>
              <button className="admin-add-button" onClick={openUpdateModal}>추가</button>
            </div>

            {/* 테이블 내용 */}
            <div className="admin-table-scroll-wrapper">
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Last login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.id}</td>
                      <td onClick={() => handleUserClick(user)} className="admin-clickable-name">
                        {user.name}
                      </td>
                      <td>{user.position}</td>
                      <td>{user.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="admin-pagination">
              <button>&lt; 이전</button>
              <span>1</span>
              <button>다음 &gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 조건 분기 */}
      {showModal && modalType === "update" && <UserUpdate onClose={closeModal} />}
      {showModal && modalType === "info" && <UserInfo user={selectedUser} onClose={closeModal} />}
    </div>
  );
};

export default Admin;