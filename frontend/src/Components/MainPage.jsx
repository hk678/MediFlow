import React, { useState, useEffect } from 'react';
import { Search, User, Users, Bed, AlertCircle, AlertTriangle } from 'lucide-react';
import logoutIcon from '../assets/images/logout-icon.png';
import UserIcon from '../assets/images/user-icon.png';
import { useNavigate } from 'react-router-dom';
import '../Style/Mainpage.css';
import History from './History';
import axios from 'axios';
import EmergencyRoom from './EmergencyRoom';


const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // 컴포넌트 내부에서 선언
  const [selectedPatient, setSelectedPatient] = useState(null); // 모달관련
  const [showModal, setShowModal] = useState(false); // 모달달
  const [labelFilter, setLabelFilter] = useState('전체'); // '전체' | '주의' | '위험'
  const [showEmergencyRoom, setShowEmergencyRoom] = useState(false);
// axios연결
const [patientData, setPatientData] = useState([]);

useEffect(() => {
  axios.get('http://localhost:8081/api/patients')
    .then(response => {
      const rawData = response.data;
      const transformed = rawData.map(p => ({
        pid: p.pid,
        name: p.name,
        age: p.age,
        sex: p.gender ? 'M' : 'F', // boolean을 성별 문자열로
        bed: p.bed,
        ktas: p.acuity,
        complaint: p.chiefComplaint,
        label: p.label === 1 ? '위험' : (p.label === 0 ? '주의' : '경미'),
        history: '확인'
      }));
      setPatientData(transformed);
    })
    .catch(error => {
      console.error('환자 데이터 불러오기 실패:', error);
    });
}, []);

  

// axios 작업업끗---------

  // 필터링(주의,위험,전체)환자보기 ---------
const handleWarningClick = () => {
  setLabelFilter('주의');
};

const handleDangerClick = () => {
  setLabelFilter('위험');
};

const resetFilter = () => {
  setLabelFilter('전체');
};
//-------------------------

  // 리스트 전환 토글
  const handleToggle = () => {
    setShowEmergencyRoom(!showEmergencyRoom);
  };


//추가부분 history이동------------------------------------------
 // ✅ 모달 열기
  const openHistoryModal = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  // ✅ 모달 닫기
  const closeHistoryModal = () => {
    setSelectedPatient(null);
    setShowModal(false);
  };

//------------------------히스토리 끗-----------------
  //추가부분 디테일로 옮기기기---------------------------
  const goToDetail = (patient) => {
    navigate(`/detail/${patient.pid}`, {
      state: {
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
      },
    });
  };
///끝/////////////////////////////////////



  // 샘플 환자 데이터
  // const patientData = [
  //   { pid: '1001', name: '김철수', age: 59, sex: 'F',bed: 12, ktas: 2, complaint: 'Chest pain', label: '위험', history: '확인' },
  //   { pid: '1002', name: '박소연', age: 34, sex: 'F',bed: 12, ktas: 4, complaint: 'Sore throat', label: '경미', history: '확인' },
  //   { pid: '1003', name: '이민호', age: 45, sex: 'M',bed: 12, ktas: 3, complaint: 'Abdominal pain', label: '주의', history: '확인' },
  //   { pid: '1004', name: '최하나', age: 78, sex: 'F',bed: 12, ktas: 1, complaint: 'Shortness of breath', label: '위험', history: '확인' },
  //   { pid: '1005', name: '김지훈', age: 67, sex: 'M',bed: 12, ktas: 5, complaint: 'Nausea', label: '경미', history: '확인' },
  //   { pid: '1006', name: '정한나', age: 22, sex: 'F',bed: 12, ktas: 4, complaint: 'Sprained ankle', label: '경미', history: '확인' },
  //   { pid: '1007', name: '오승우', age: 45, sex: 'M',bed: 12, ktas: 4, complaint: 'Fever', label: '주의', history: '확인' },
  //   { pid: '1008', name: '김미라', age: 60, sex: 'F',bed: 21, ktas: 4, complaint: 'Altered mental status', label: '경미', history: '확인' },
  //   { pid: '1009', name: '한보미', age: 50, sex: 'F',bed: 12, ktas: 2, complaint: 'High blood pressure', label: '위험', history: '확인' },
  //   { pid: '1010', name: '양세현', age: 40, sex: 'M',bed: 12, ktas: 5, complaint: 'Skin rash', label: '경미', history: '확인' },
  //   { pid: '1011', name: '서지민', age: 29, sex: 'F',bed: 113, ktas: 1, complaint: 'Seizure', label: '위험', history: '확인' },
  //   { pid: '1012', name: '박민우', age: 65, sex: 'F',bed: 15, ktas: 3, complaint: 'Dizziness', label: '주의', history: '확인' },
  //   { pid: '1013', name: '신아름', age: 37, sex: 'F',bed: 14, ktas: 2, complaint: 'Back pain', label: '위험', history: '확인' },
  //   { pid: '1014', name: '김도현', age: 52, sex: 'M',bed: 12, ktas: 2, complaint: 'Cardiac arrest', label: '위험', history: '확인' }
  // ];

  const getLabelClass = (label) => {
    switch(label) {
      case '위험': return 'label label-danger';
      case '경미': return 'label label-success';
      case '주의': return 'label label-warning';
      default: return 'label';
    }
  };
// ----------- 필터 부분----------------------------------
//  const filteredPatients = patientData.filter(patient =>
//    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//    patient.complaint.toLowerCase().includes(searchTerm.toLowerCase())
//);
// 환자 검색부분끗-------------------------
// 필터링
const filteredPatients = patientData.filter((patient) => {
  const matchesSearch = 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.complaint.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesLabel = labelFilter === '전체' ? true : patient.label === labelFilter;

  return matchesSearch && matchesLabel;
});


//---------------끝----------------------------------
  return (
    <div className="medical-dashboard">
      <div className="dashboard-content">
        {/* Header - OldEmergencyRoom.jsx와 동일한 구조 */}
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <span className="logo-text" onClick={resetFilter}>MediFlow</span>
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
              <img src={UserIcon} alt="logout" className="user-icon" />
              <span className="user-name">의사 이도은</span>
              <div className="logout-button">
                <img src={logoutIcon} alt="logout" className="logout-icon" />
                <span className="logout-text">Logout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - OldEmergencyRoom.jsx와 동일한 구조 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <Users className="stat-icon blue" />
              <div>
                <div className="stat-number blue">29</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <Bed className="stat-icon blue" />
              <div>
                <div className="stat-number blue">19/28</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card stat-card-danger">
            <div className="stat-content">
              <AlertCircle className="stat-icon red" />
              <div className="stat-text">
                <div className="stat-label" onClick={handleDangerClick}>위험 환자</div>
                <div className="stat-number red">6</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card stat-card-warning">
            <div className="stat-content">
              <AlertTriangle className="stat-icon yellow" />
              <div className="stat-text">
                <div className="stat-label" onClick={handleWarningClick}>주의 환자</div>
                <div className="stat-number yellow">7</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <span className="toggle-label">
              {showEmergencyRoom ? '환자 리스트 보기' : '응급실 배치도 보기'}
            </span>
            <div className={`toggle-switch ${showEmergencyRoom ? 'active' : ''}`} onClick={handleToggle}>
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>



        {/* 조건부 렌더링 - 환자 목록 페이지와 연동 */}
        {showEmergencyRoom ? (
          // showEmergencyRoom가 true일 때 - 응급실 배치도 표시
          <EmergencyRoom hideHeader={true} />
        ) : (
          // showEmergencyRoom가 false일 때 - 환자 목록 표시
          <div className="table-container">
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">PID</th>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell">Age</th>
                    <th className="table-header-cell">Gender</th>
                    <th className="table-header-cell">Bed</th>
                    <th className="table-header-cell">KTAS</th>
                    <th className="table-header-cell">Chief Complaint</th>
                    <th className="table-header-cell">Label</th>
                    <th className="table-header-cell">History</th>
                  </tr>
                </thead>
              <tbody>
                {filteredPatients.slice(0, 20).map((patient) => (
                  <tr key={patient.pid} className="table-row">
                    <td className="table-cell">{patient.pid}</td>
                    <td className="table-cell clickable" onClick={() => goToDetail(patient)}>{patient.name}</td>
                    <td className="table-cell">{patient.age}</td>
                    <td className="table-cell">{patient.sex}</td>
                    <td className="table-cell">{patient.bed}</td>
                    <td className="table-cell">{patient.ktas}</td>
                    <td className="table-cell">{patient.complaint}</td>
                    <td className="table-cell">
                      <span className={getLabelClass(patient.label)}>{patient.label}</span>
                    </td>
                    <td className="table-cell">
                      <span className="history-link" onClick={()=>openHistoryModal(patient)}>{patient.history}</span>
                    </td>                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                <span className="pagination-text">&lt; 이전</span>
                <span className="pagination-current">1</span>
                <span className="pagination-text">다음 &gt;</span>
              </div>
            </div>
          </div>
        )}

        {/* 모달창 - 조건부 렌더링 밖으로 이동 */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <History patient={selectedPatient} onClose={closeHistoryModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default MainPage;