
import "../Style/Mainpage.css";  // 공통 헤더/스탯카드 스타일
import "../Style/Admin.css";     // Admin 전용 스타일
import React, { useState, useEffect } from "react";
import { Search, User, Users, Bed, AlertCircle, AlertTriangle } from 'lucide-react';
import logoutIcon from '../assets/images/logout-icon.png';
import UserUpdate from "./UserUpdate";
import UserInfo from "./UserInfo";
import axios from "axios";

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "update" 또는 "info"
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [daily, setDaily] = useState([""]);

  // 사용자 목록 불러오기 함수 (재사용 가능)
  const fetchUsers = () => {
    axios.get("http://localhost:8081/api/admin/users")
      .then((res) => {
        console.log("백엔드 응답보기", res.data);
        setUserList(res.data);
      });
  };
  
  // 처음 한 번만 사용자 목록 로딩
  useEffect(() => {
    fetchUsers();
  }, []);

  //daily 불러오기기
  const fetchDaily = () => {
    axios. get("http://localhost:8081/api/admin/daily")
    .then((res)=>{
      console.log("데이터 응답보기",res.data)
      setDaily(res.data)
    })
  }
  
useEffect(()=> {
  fetchDaily();
},[])

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

  //  모달 닫기 + 필요 시 목록 새로고침
  const closeModal = (refresh = false) => {
    setShowModal(false);
    setModalType(null);
    if (refresh) {
      fetchUsers(); //  변경: 수정 후 최신 데이터 반영
    }
  };

  // 검색 필터링
  const filteredUsers = userList.filter(
    (user) =>
      user.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userRole?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="user-icon">👤</span>
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
                        <td>{user.userId}</td>
                        <td onClick={() => handleUserClick(user)} className="clickable-name">
                          {user.userName}
                        </td>
                        <td>{user.userRole}</td>
                        <td>{user.lastLogin || user.createdAt}</td>
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