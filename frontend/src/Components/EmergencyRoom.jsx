import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Users, Bed, AlertCircle, AlertTriangle, LogOut } from 'lucide-react';
import logoutIcon from '../assets/images/logout-icon.png';
import UserIcon from '../assets/images/user-icon.png';
import MainPage from './MainPage';
import EmergencyModal from './EmergencyModal'; // 환자 선택 모달
import DischargeModal from './DischargeModal'; // 퇴실 모달
import '../Style/Mainpage.css';        // 공통 헤더/스탯카드 스타일
import '../Style/Emergencyroom.css';   // EmergencyRoom 전용 스타일

const EmergencyRoom = ({ hideHeader = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientList, setShowPatientList] = useState(false);
  
  // 모달 상태 관리
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // 임시 대기 환자 데이터 (나중에 Context로 교체)
  const waitingPatients = [
    { pid: '1001', name: '김철수', age: 59, sex: 'M', ktas: 2, complaint: 'Chest pain', waitingTime: '45분' },
    { pid: '1002', name: '박소연', age: 34, sex: 'F', ktas: 4, complaint: 'Sore throat', waitingTime: '20분' },
    { pid: '1003', name: '이민호', age: 45, sex: 'M', ktas: 3, complaint: 'Abdominal pain', waitingTime: '30분' },
    { pid: '1004', name: '최하나', age: 78, sex: 'F', ktas: 1, complaint: 'Shortness of breath', waitingTime: '60분' },
    { pid: '1005', name: '김지훈', age: 67, sex: 'M', ktas: 5, complaint: 'Nausea', waitingTime: '15분' }
  ];

  // 리스트 전환 토글
  const handleToggle = () => {
    setShowPatientList(!showPatientList);
  };

  // 병상 클릭 이벤트 핸들러
  const handleBedClick = (bed) => {
    if (bed.status === 'green' || bed.status === 'empty') {
      // 빈 병상 클릭 시 환자 선택 모달 열기
      setSelectedBed(bed);
      setShowPatientModal(true);
    } else {
      // 환자가 있는 병상 클릭 시 퇴실 모달 열기
      setSelectedBed(bed);
      setShowDischargeModal(true);
    }
  };

  // 환자 배치 처리
  const handlePatientAssign = (patient) => {
    console.log(`환자 ${patient.name}을 병상 ${selectedBed.name}에 배치`);
    // TODO: 실제 배치 로직 구현 (Context API 연동 시)
    setShowPatientModal(false);
    setSelectedBed(null);
  };

  // 환자 퇴실 처리
  const handlePatientDischarge = () => {
    console.log(`병상 ${selectedBed.name}의 환자 퇴실 처리`);
    // TODO: 실제 퇴실 로직 구현 (병상 상태 초기화)
    setShowDischargeModal(false);
    setSelectedBed(null);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowPatientModal(false);
    setShowDischargeModal(false);
    setSelectedBed(null);
  };

  // 4x4 그리드에 맞춘 병상 데이터 구성 - 업로드된 이미지와 정확히 동일한 배치
  const quadrantData = {
    // 1사분면 (좌상단)
    quadrant1: [
      { id: 'q1-1', name: 'B10', room: ' ', status: 'green', position: { row: 1, col: 1 } },
      { id: 'q1-2', name: 'B09', room: ' ', status: 'yellow', position: { row: 1, col: 2 } },
      { id: 'q1-3', name: 'B08', room: ' ', status: 'red', position: { row: 1, col: 3 } },
      { id: 'q1-4', name: 'B07', room: ' ', status: 'red', position: { row: 1, col: 4 } },
      { id: 'q1-5', name: 'B06', room: ' ', status: 'red', position: { row: 2, col: 1 } },
      { id: 'q1-6', name: 'B05', room: ' ', status: 'red', position: { row: 2, col: 4 } },
      { id: 'q1-7', name: 'B04', room: ' ', status: 'red', position: { row: 3, col: 1 } },
      { id: 'q1-8', name: 'B03', room: ' ', status: 'red', position: { row: 3, col: 4 } },
      { id: 'q1-9', name: 'B02', room: ' ', status: 'red', position: { row: 4, col: 1 } },
      { id: 'q1-10', name: 'B01', room: ' ', status: 'red', position: { row: 4, col: 4 } },
    ],
    
    // 2사분면 (우상단)
    quadrant2: [
      { id: 'q2-1', name: 'A07', room: ' ', status: 'green', position: { row: 1, col: 1 } },
      { id: 'q2-2', name: 'A06', room: ' ', status: 'green', position: { row: 1, col: 2 } },
      { id: 'q2-3', name: 'A05', room: ' ', status: 'green', position: { row: 1, col: 3 } },
      { id: 'q2-4', name: 'A04', room: '최순자', status: 'yellow', position: { row: 1, col: 4 } },
      { id: 'q2-5', name: 'A08', room: '김철수 ', status: 'red', position: { row: 2, col: 1 } },
      { id: 'q2-6', name: 'A03', room: ' ', status: 'red', position: { row: 2, col: 4 } },
      { id: 'q2-7', name: 'A09', room: '박민철', status: 'yellow', position: { row: 3, col: 1 } },
      { id: 'q2-8', name: 'A02', room: '최진철', status: 'yellow', position: { row: 3, col: 4 } },
      { id: 'q2-9', name: 'A10', room: ' ', status: 'green', position: { row: 4, col: 1 } },
      { id: 'q2-10', name: 'A01', room: ' ', status: 'green', position: { row: 4, col: 4 } }
    ],

    // 3사분면 (좌하단)
    quadrant3: [
      { id: 'q3-1', name: ' ', room: '01/응급실', status: 'green', position: { row: 1, col: 1 } },
      { id: 'q3-2', name: '김민수', room: '01/응급실', status: 'red', position: { row: 2, col: 1 } },
      { id: 'q3-3', name: '김민수', room: '01/응급실', status: 'yellow', position: { row: 3, col: 1 } },
      { id: 'q3-4', name: '김민수', room: '01/응급실', status: 'yellow', position: { row: 4, col: 1 } },
      { id: 'q3-5', name: ' ', room: ' ', status: 'yellow', position: { row: 4, col: 2 } },
      { id: 'q3-6', name: ' ', room: ' ', status: 'red', position: { row: 4, col: 3 } },
      { id: 'q3-7', name: '환자명', room: '01/응급실', status: 'green', position: { row: 4, col: 4 } },
      { id: 'q3-8', name: ' ', room: ' ', status: 'green', position: { row: 4, col: 5 } }
    ],

    // 4사분면 (우하단) - 대부분 빈공간, 우하단에만 1개
    quadrant4: []
  };

  const getBedClassName = (status) => {
    const baseClass = 'emergency-bed-card';
    switch(status) {
      case 'red': return `${baseClass} emergency-bed-red`;
      case 'yellow': return `${baseClass} emergency-bed-yellow`;
      case 'green': return `${baseClass} emergency-bed-green`;
      case 'orange': return `${baseClass} emergency-bed-orange`;
      case 'empty': return `${baseClass} emergency-bed-empty`;
      default: return `${baseClass} emergency-bed-empty`;
    }
  };

  const BedCard = ({ bed }) => (
    <div 
      className={getBedClassName(bed.status)}
      onClick={() => handleBedClick(bed)} // 클릭 이벤트 추가
      style={{ cursor: 'pointer' }} // 커서 변경
    >
      {bed.name && (
        <div className="emergency-bed-content">
          <div className="emergency-bed-name">{bed.name}</div>
          <div className="emergency-bed-room">{bed.room}</div>
        </div>
      )}
    </div>
  );

  const Quadrant = ({ data, className }) => (
    <div className={`emergency-quadrant ${className}`}>
      {data.map(bed => (
        <div
          key={bed.id}
          className="emergency-bed-position"
          style={{
            gridRow: bed.position.row,
            gridColumn: bed.position.col
          }}
        >
          <BedCard bed={bed} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="medical-dashboard emergency-page">
      <div className="dashboard-content">
        {/* Header - hideHeader가 false일 때만 표시 (공통 스타일 사용) */}
        {!hideHeader && (
          <>
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
                  <span className="user-name">의사 이도은</span>
                  <div className="logout-button">
                    <img src={logoutIcon} alt="logout" className="logout-icon" />
                    <span className="logout-text">Logout</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards (공통 스타일 사용) */}
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
                    <div className="stat-label">위험 환자</div>
                    <div className="stat-number red">6</div>
                  </div>
                </div>
              </div>
              
              <div className="stat-card stat-card-warning">
                <div className="stat-content">
                  <AlertTriangle className="stat-icon yellow" />
                  <div className="stat-text">
                    <div className="stat-label">주의 환자</div>
                    <div className="stat-number yellow">7</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="emergency-room-container">
          <div className="emergency-room-layout">
            {/* A구역 라벨 */}
            <div className="emergency-area-label emergency-area-label-a">A구역</div>
            
            {/* B구역 라벨 */}
            <div className="emergency-area-label emergency-area-label-b">B구역</div>

            {/* 4개 사분면 */}
            <Quadrant data={quadrantData.quadrant2} className="emergency-quadrant-2" />
            <Quadrant data={quadrantData.quadrant1} className="emergency-quadrant-1" />
            <Quadrant data={quadrantData.quadrant3} className="emergency-quadrant-3" />
            <Quadrant data={quadrantData.quadrant4} className="emergency-quadrant-4" />

            {/* 기타 요소들 */}
            <div className="emergency-partition-wall"></div>
            <div className="emergency-entrance">
              <div className="emergency-entrance-text">Entrance</div>
            </div>
            <div className="emergency-nurse-station">
              <div className="emergency-nurse-station-text">Nurse Station</div>
            </div>
          </div>
        </div>

        {/* 환자 선택 모달 */}
        {showPatientModal && (
          <EmergencyModal 
            bed={selectedBed}
            patients={waitingPatients}
            onAssign={handlePatientAssign}
            onClose={closeModal}
          />
        )}

        {/* 환자 퇴실 모달 */}
        {showDischargeModal && (
          <DischargeModal 
            bed={selectedBed}
            onDischarge={handlePatientDischarge}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default EmergencyRoom;