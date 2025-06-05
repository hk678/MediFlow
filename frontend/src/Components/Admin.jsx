import "../Style/Admin.css";
import React, { useState } from "react";
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
    <div className="dashboard-container">
      {/* 상단 검색창 & 관리자 표시 */}
      <div className="dashboard-header">
        {/* 로고고 */}
        <span className="logo-text">MediFlow</span>
        {/* 검색창창 */}
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="user-info">
          <span className="user-icon">👤</span>
          <span className="user-name">관리자</span>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div className="dashboard-graph">
        <p>📊 여기에 그래프 들어감</p>
      </div>

      {/* 사용자 관리 테이블 */}
      <div className="dashboard-table-section">
        <div className="table-header">
          <span>사용자 관리</span>
          <button className="add-button" onClick={openUpdateModal}>추가</button>
        </div>

        {/* 테이블 내용 */}
        <div className="table-scroll-wrapper">
          <table className="user-table">
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
                  <td onClick={() => handleUserClick(user)} className="clickable-name">
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
        <div className="pagination">
          <button>&lt; 이전</button>
          <span>1</span>
          <button>다음 &gt;</button>
        </div>
      </div>

      {/* 모달 조건 분기 */}
      {showModal && modalType === "update" && <UserUpdate onClose={closeModal} />}
      {showModal && modalType === "info" && <UserInfo user={selectedUser} onClose={closeModal} />}
    </div>
  );
};

export default Admin;
