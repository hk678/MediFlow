import "../Style/Admin.css";
import React, { useState, useEffect } from "react";
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
    <div className="dashboard-container">
      {/* 상단 검색창 & 관리자 표시 */}
      <div className="dashboard-header">
        <span className="logo-text">MediFlow</span>
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
