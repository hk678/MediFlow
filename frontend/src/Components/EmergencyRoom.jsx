import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Users, Bed, AlertCircle, AlertTriangle, LogOut } from 'lucide-react';
import logoutIcon from '../assets/images/logout-icon.png';
import UserIcon from '../assets/images/user-icon.png';
import MainPage from './MainPage';
import '../Style/emergencyroom.css';

const EmergencyRoom = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientList, setShowPatientList] = useState(false);

  // 리스트 전환 토글
  const handleToggle = () => {
    setShowPatientList(!showPatientList);
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
      { id: 'q2-1', name: 'A10', room: ' ', status: 'green', position: { row: 1, col: 1 } },
      { id: 'q2-2', name: 'A09', room: ' ', status: 'green', position: { row: 1, col: 2 } },
      { id: 'q2-3', name: 'A08', room: ' ', status: 'green', position: { row: 1, col: 3 } },
      { id: 'q2-4', name: 'A07', room: ' ', status: 'yellow', position: { row: 1, col: 4 } },
      { id: 'q2-5', name: 'A06', room: ' ', status: 'red', position: { row: 2, col: 1 } },
      { id: 'q2-6', name: 'A05', room: ' ', status: 'red', position: { row: 2, col: 4 } },
      { id: 'q2-7', name: 'A03', room: ' ', status: 'yellow', position: { row: 3, col: 1 } },
      { id: 'q2-8', name: 'A03', room: ' ', status: 'yellow', position: { row: 3, col: 4 } },
      { id: 'q2-9', name: 'A02', room: ' ', status: 'green', position: { row: 4, col: 1 } },
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
      { id: 'q3-7', name: ' ', room: ' ', status: 'green', position: { row: 4, col: 5 } }
    ],

    // 4사분면 (우하단) - 대부분 빈공간, 우하단에만 1개
    quadrant4: [
       
    ]
  };

  const getBedClassName = (status) => {
    const baseClass = 'bed-card';
    switch(status) {
      case 'red': return `${baseClass} bed-red`;
      case 'yellow': return `${baseClass} bed-yellow`;  
      case 'green': return `${baseClass} bed-green`;
      case 'orange': return `${baseClass} bed-orange`;
      case 'empty': return `${baseClass} bed-empty`;
      default: return `${baseClass} bed-empty`;
    }
  };

  const BedCard = ({ bed }) => (
    <div className={getBedClassName(bed.status)}>
      {bed.name && (
        <div className="bed-content">
          <div className="bed-name">{bed.name}</div>
          <div className="bed-room">{bed.room}</div>
        </div>
      )}
    </div>
  );

  const Quadrant = ({ data, className }) => (
    <div className={`quadrant ${className}`}>
      {data.map(bed => (
        <div 
          key={bed.id} 
          className="bed-position"
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
    <div className="medical-dashboard">
      <div className="dashboard-content">
        {/* Header */}
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
              <img src={UserIcon} alt="user" className="user-icon" />
              <span className="user-name">의사 이도은</span>
              <div className="logout-button">
                <img src={logoutIcon} alt="logout" className="logout-icon" />
                <span className="logout-text">Logout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* 3. Toggle Switch */}
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <span className="toggle-label">
             {showPatientList ? '응급실 배치도로 보기' : '환자 리스트로 보기'}
            </span>
            <div className={`toggle-switch ${showPatientList ? 'active' : ''}`} onClick={handleToggle}>
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>

        {/* 4. 조건부 렌더링 - 환자 목록 페이지와 연동 */}
        {showPatientList ? (
          // showPatientList가 true일 때 - 환자 목록 표시
          <MainPage hideHeader={true} />
          // <div className="patient-list-container">
          //   <p>환자 목록 페이지 (추후 구현)</p>
          // </div>
        ) : (
          // showPatientList가 false일 때 - 응급실 배치도 표시
          <div className="emergency-room-container">
            <div className="room-layout">
              {/* A구역 라벨 */}  
              <div className="area-label area-label-a">A구역</div>
              
              {/* B구역 라벨 */}
              <div className="area-label area-label-b">B구역</div>

              {/* 4개 사분면 */}
              <Quadrant data={quadrantData.quadrant2} className="quadrant-2" />
              <Quadrant data={quadrantData.quadrant1} className="quadrant-1" />
              <Quadrant data={quadrantData.quadrant3} className="quadrant-3" />
              <Quadrant data={quadrantData.quadrant4} className="quadrant-4" />

              {/* 기타 요소들 */}
              <div className="partition-wall"></div>
              <div className="entrance">
                <div className="entrance-text">Entrance</div>
              </div>
              <div className="nurse-station">
                <div className="nurse-station-text">Nurse Station</div>
              </div>
            </div>
          </div>
        )}

      </div> 
    </div> 
  );
};

export default EmergencyRoom;