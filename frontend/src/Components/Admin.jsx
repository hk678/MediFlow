import "../Style/Mainpage.css";  // 공통 헤더/스탯카드 스타일
import "../Style/Admin.css";     // Admin 전용 스타일
import React, { useState, useEffect } from "react";
import { Search, User, Users, Bed, AlertCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoutIcon from '../assets/images/logout-icon.png';
import AdminUserIcon from '../assets/images/admin-user-icon.svg'; // 관리자 유저 아이콘 추가
import UserUpdate from "./UserUpdate";
import UserInfo from "./UserInfo";
import axios from "axios";
import { useAuth } from './AuthContext'; // AuthContext 추가

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "update" 또는 "info"
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [daily, setDaily] = useState([""]);
  const navigate = useNavigate();

  // AuthContext 사용
  const { user, logout } = useAuth();

  // 뒤로가기 방지 - 관리자만 적용
  useEffect(() => {
    // 현재 사용자가 관리자인 경우에만 뒤로가기 방지 적용
    if (user?.userRole === '관리자') {
      const handlePopState = (event) => {
        // 관리자 페이지에서 뒤로가기 시 다시 관리자 페이지로
        window.history.pushState(null, '', '/admin');
      };

      // 현재 페이지를 히스토리에 추가
      window.history.pushState(null, '', '/admin');
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [user]); // user 의존성 추가

  // 관리자 권한 확인
  useEffect(() => {
    if (user && user.userRole !== '관리자') {
      console.log('관리자가 아닌 사용자의 관리자 페이지 접근 시도:', user.userRole);
      // alert('관리자 권한이 필요합니다.');
      navigate(user.defaultPage || '/');
      return;
    }
  }, [user, navigate]);

  // axios 기본 설정 - 세션 쿠키 포함
  axios.defaults.withCredentials = true;

  // 사용자 목록 불러오기 함수 (재사용 가능)
  const fetchUsers = () => {
    axios.get("http://localhost:8081/api/admin/users", {
      withCredentials: true  // 세션 쿠키 포함
    })
      .then((res) => {
        console.log("백엔드 응답보기", res.data);
        setUserList(res.data);
      })
      .catch((error) => {
        console.error("사용자 목록 조회 실패:", error);
        // 403 에러 처리
        if (error.response?.status === 403) {
          console.error("권한이 없습니다. 관리자 권한이 필요합니다.");
          alert("접근 권한이 없습니다. 관리자 권한이 필요합니다.");
          navigate('/');
        }
      });
  };

  // 처음 한 번만 사용자 목록 로딩
  useEffect(() => {
    if (user?.userRole === '관리자') {
      fetchUsers();
    }
  }, [user]);

  //daily 불러오기기
  const fetchDaily = () => {
    axios.get("http://localhost:8081/api/admin/daily", {
      withCredentials: true  // 세션 쿠키 포함
    })
      .then((res) => {
        console.log("데이터 응답보기", res.data);
        setDaily(res.data);
      })
      .catch((error) => {
        console.error("일일 데이터 조회 실패:", error);
        // 403 에러 처리
        if (error.response?.status === 403) {
          console.error("권한이 없습니다. 관리자 권한이 필요합니다.");
          navigate('/');
        }
      });
  }

  useEffect(() => {
    if (user?.userRole === '관리자') {
      fetchDaily();
    }
  }, [user]);

  // 로그아웃 핸들러 추가
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 오류가 발생해도 로그인 페이지로 이동
      navigate('/login');
    }
  };

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

  // 관리자가 아닌 경우 접근 차단
  if (user && user.userRole !== '관리자') {
    return (
      <div className="access-denied">
        <h2>접근 권한이 없습니다.</h2>
        <p>관리자 권한이 필요합니다.</p>
      </div>
    );
  }

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
            <div className="admin-user-info">
              {/* 사용자 아이콘을 AdminUserIcon 이미지로 변경 */}
              <img src={AdminUserIcon} alt="user" className="admin-user-icon" />
              <span className="admin-user-name">{user?.userRole} {user?.userName}</span>

              {/* 로그아웃 버튼에 클릭 이벤트 추가 */}
              <div className="logout-button" onClick={handleLogout}>
                <img src={logoutIcon} alt="logout" className="logout-icon" />
                <span className="logout-text">Logout</span>
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