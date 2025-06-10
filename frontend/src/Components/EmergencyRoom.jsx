import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Users, Bed, AlertCircle, AlertTriangle, LogOut } from 'lucide-react';
import logoutIcon from '../assets/images/logout-icon.png';
import UserIcon from '../assets/images/user-icon.png';
import MainPage from './MainPage';
import EmergencyModal from './EmergencyModal';
import DischargeModal from './DischargeModal';
import '../Style/Mainpage.css';
import '../Style/Emergencyroom.css';
import axios from "axios";

const EmergencyRoom = ({ hideHeader = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 모달 상태 관리
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // 대기 환자 백엔드 연동
  const [waitingPatients, setWaitingPatients] = useState([]);

  // 병상 상태 백엔드 연동
  const [bedStatuses, setBedStatuses] = useState({});
  const [bedLoading, setBedLoading] = useState(true);

  // 대기 시간 함수
  const calculateWaitingTime = () => {
    const minutes = Math.floor(Math.random() * 120) + 10;
    return `${minutes}분`;
  };

  // 병상 상태 가져오기 - 백엔드 연동
  const getBedStatuses = async () => {
    try {
      setBedLoading(true);
      
      const response = await axios.get('http://localhost:8081/api/patients');
      const bedStatusMap = {};
      
      for (const patient of response.data) {
        if (patient.bedNumber) {
          bedStatusMap[patient.bedNumber] = {
            patientId: patient.pid,
            patientName: patient.patient,
            visitId: patient.visitId || patient.visit_id || patient.id,
            ktas: patient.acuity,
            status: getBedStatusFromKTAS(patient.acuity),
            age: patient.age,
            gender: patient.gender,
            chiefComplaint: patient.chiefComplaint,
            diagnosis: patient.diagnosis || '진단 대기',
            pain: patient.pain || 0,
            admissionTime: patient.admissionTime || new Date().toISOString(),
            arrivalTransport: patient.arrivalTransport || 'UNKNOWN'
          };
        }
      }
      
      // 로컬 스토리지에서 토글 유지용 배치 정보 복원
      const savedAssignments = JSON.parse(localStorage.getItem('patientAssignments') || '{}');

      // 🔍 디버깅 로그 추가
      console.log('=== 디버깅 시작 ===');
      console.log('savedAssignments:', savedAssignments);
      
      // 로컬 스토리지의 배치 정보를 백엔드 데이터와 병합
      for (const [bedName, assignment] of Object.entries(savedAssignments)) {
        // 백엔드에 없고 로컬에만 있는 배치 정보 추가
        if (!bedStatusMap[bedName]) {
          bedStatusMap[bedName] = {
            ...assignment,
            status: assignment.status || getBedStatusFromKTAS(assignment.ktas)
          };
          console.log(`병상 ${bedName} 복원:`, bedStatusMap[bedName]);
        }
      }

      console.log('최종 bedStatusMap:', bedStatusMap);

      setBedStatuses(bedStatusMap);
      
    } catch (error) {
      console.error('병상 상태 조회 실패:', error);
      
      // 백엔드 실패 시 로컬 스토리지만으로도 동작
      const savedAssignments = JSON.parse(localStorage.getItem('patientAssignments') || '{}');
      setBedStatuses(savedAssignments);
    } finally {
      setBedLoading(false);
    }
  };

  // KTAS 등급에 따른 병상 상태 결정
  const getBedStatusFromKTAS = (ktas) => {
    switch (ktas) {
      case 1:
      case 2:
        return 'red';
      case 3:
        return 'yellow';
      case 4:
      case 5:
        return 'green';
      default:
        return 'empty';
    }
  }; 

  // 대기 환자 목록 불러오기
  const getWaitingPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/patients');

      const waitingOnly = response.data.filter(patient => !patient.bedNumber); 
      
      const transformedData = waitingOnly.map(patient => ({
        pid: patient.pid,
        name: patient.name || patient.patientName || patient.patient || `환자 ${patient.pid}`,
        age: patient.age,
        sex: patient.gender === 0 ? 'M' : 'F',
        ktas: patient.acuity,
        complaint: patient.chiefComplaint,
        waitingTime: calculateWaitingTime(),
        visitId: patient.visitId
      }));
        
      setWaitingPatients(transformedData);
    } catch (error) {
      console.error('대기 환자 목록 불러오기 실패:', error);
      setWaitingPatients([]);
    } 
  };
   
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    getBedStatuses();
    getWaitingPatients();
  }, []);

  // 병상 데이터 새로고침(5분)
  useEffect(() => {
    const interval = setInterval(() => {
      getBedStatuses();
      getWaitingPatients();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  // 병상 클릭 이벤트 핸들러
  const handleBedClick = (bed) => {
    const bedData = bedStatuses[bed.name];
    const hasPatient = bedData && bedData.patientName;
    
    if (!hasPatient) {
      // 빈 병상 클릭 시 - 환자 배치 모달 열기
      setSelectedBed({
        ...bed,
        bedData: null
      });
      setShowPatientModal(true);
    } else {
      // 환자 있는 병상 클릭 시 - 퇴실 모달 열기
      setSelectedBed({
        ...bed,
        bedData: bedData,
        patient: {
          name: bedData.patientName,
          visitId: bedData.visitId,
          ktas: bedData.ktas
        }
      });
      setShowDischargeModal(true);
    }
  };

  // 환자 배치 처리 - 오류 때문에 console log 입력 
  const handlePatientAssign = async (patient, bedName, newBedStatus) => {
    try {
      console.log(`환자 ${patient.name}을 병상 ${bedName}에 배치 완료`);
      
      // 1. 즉시 UI 업데이트 - 로컬 상태에 새 병상 정보 추가
      setBedStatuses(prevStatuses => ({
        ...prevStatuses,
        [bedName]: {
          ...newBedStatus,
          source: 'newAssignment'
        }
      }));
      
      // 2. 대기환자 목록에서 해당 환자 제거
      setWaitingPatients(prevPatients => 
        prevPatients.filter(p => p.pid !== patient.pid)
      );
      
      // 3. 로컬 스토리지에도 저장 (토글 전환시 병상정보 유지)
      const savedAssignments = JSON.parse(localStorage.getItem('patientAssignments') || '{}');
      savedAssignments[bedName] = {
        patientId: patient.pid,
        patientName: patient.name,
        visitId: patient.visitId,
        assignedAt: new Date().toISOString(),
        bedNumber: bedName
      };
      localStorage.setItem('patientAssignments', JSON.stringify(savedAssignments));
      
      console.log('로컬 스토리지 저장 완료:', savedAssignments);
      
      // 4. 백엔드 새로고침 (백그라운드에서 실행)
      setTimeout(async () => {
        await getWaitingPatients();
      }, 1000);
      
    } catch (error) {
      console.error('배치 후 데이터 새로고침 실패:', error);
    } finally {
      setShowPatientModal(false);
      setSelectedBed(null);
    }
  };

  // 환자 퇴실 처리(DischargeModal에서 호출) - 안전한 버전
  // EmergencyRoom.jsx - 191~220줄 handlePatientDischarge 함수 완전 교체

  const handlePatientDischarge = async () => {
    try {
      console.log(`병상 ${selectedBed.name}의 환자 퇴실 처리 완료`);
      
      // 1. 즉시 UI 업데이트 - 해당 병상을 빈 상태로 변경
      setBedStatuses(prevStatuses => {
        const newStatuses = { ...prevStatuses };
        delete newStatuses[selectedBed.name]; // 해당 병상 데이터 제거
        return newStatuses;
      });
      
      // 2. 로컬 스토리지에서도 해당 배치 제거
      const savedAssignments = JSON.parse(localStorage.getItem('patientAssignments') || '{}');
      delete savedAssignments[selectedBed.name];
      localStorage.setItem('patientAssignments', JSON.stringify(savedAssignments));
      
      console.log('💾 로컬 스토리지 퇴실 처리 완료');
      
      // 3. 백엔드 새로고침
      await getWaitingPatients();
      await getBedStatuses();
      
    } catch (error) {
      console.error('퇴실 처리 실패:', error);
      alert('퇴실 처리에 실패했습니다.');
    } finally {
      setShowDischargeModal(false);
      setSelectedBed(null);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShowPatientModal(false);
    setShowDischargeModal(false);
    setSelectedBed(null);
  };

  // 병상 4구역으로 분리
  const baseBedLayouts = {
    // 1사분면 (B구역 - ICU)
    quadrant1: [
      { id: 'q1-1', name: 'B07', position: { row: 1, col: 1 } },
      { id: 'q1-2', name: 'B06', position: { row: 1, col: 2 } },
      { id: 'q1-3', name: 'B05', position: { row: 1, col: 3 } },
      { id: 'q1-4', name: 'B04', position: { row: 1, col: 4 } },
      { id: 'q1-5', name: 'B08', position: { row: 2, col: 1 } },
      { id: 'q1-6', name: 'B03', position: { row: 2, col: 4 } },
      { id: 'q1-7', name: 'B09', position: { row: 3, col: 1 } },
      { id: 'q1-8', name: 'B02', position: { row: 3, col: 4 } },
      { id: 'q1-9', name: 'B10', position: { row: 4, col: 1 } },
      { id: 'q1-10', name: 'B01', position: { row: 4, col: 4 } },
    ],
    
    // 2사분면 (A구역 - 일반병동)
    quadrant2: [
      { id: 'q2-1', name: 'A07', position: { row: 1, col: 1 } },
      { id: 'q2-2', name: 'A06', position: { row: 1, col: 2 } },
      { id: 'q2-3', name: 'A05', position: { row: 1, col: 3 } },
      { id: 'q2-4', name: 'A04', position: { row: 1, col: 4 } },
      { id: 'q2-5', name: 'A08', position: { row: 2, col: 1 } },
      { id: 'q2-6', name: 'A03', position: { row: 2, col: 4 } },
      { id: 'q2-7', name: 'A09', position: { row: 3, col: 1 } },
      { id: 'q2-8', name: 'A02', position: { row: 3, col: 4 } },
      { id: 'q2-9', name: 'A10', position: { row: 4, col: 1 } },
      { id: 'q2-10', name: 'A01', position: { row: 4, col: 4 } }
    ],

    // 3사분면 (관찰실/기타)
    quadrant3: [
      { id: 'q3-1', name: 'A11', position: { row: 1, col: 1 } },
      { id: 'q3-2', name: 'A12', position: { row: 2, col: 1 } },
      { id: 'q3-3', name: 'A13', position: { row: 3, col: 1 } },
      { id: 'q3-4', name: 'A14', position: { row: 4, col: 1 } },
      { id: 'q3-5', name: 'A15', position: { row: 4, col: 2 } },
      { id: 'q3-6', name: 'A16', position: { row: 4, col: 3 } },
      { id: 'q3-7', name: 'A17', position: { row: 4, col: 4 } },
      { id: 'q3-8', name: 'A18', position: { row: 4, col: 5 } }
    ],

    // 4사분면 (빈 공간)
    quadrant4: []
  };

  // 백엔드 데이터를 병상 레이아웃에 적용하는 함수
  const applyBackendDataToQuadrants = (baseLayouts, bedStatuses) => {
    const result = {};
    
    Object.keys(baseLayouts).forEach(quadrantKey => {
      result[quadrantKey] = baseLayouts[quadrantKey].map(bed => {
        if (bed.name) {
          const bedData = bedStatuses[bed.name];
          return {
            ...bed,
            status: bedData ? bedData.status : 'empty',
            room: bedData ? bedData.patientName : ''
          };
        } else {
          return {
            ...bed,
            status: 'empty',
            room: ''
          };
        }
      });
    });
    
    return result;
  };

  // 동적으로 백엔드 데이터가 적용된 병상 데이터 생성
  const quadrantData = applyBackendDataToQuadrants(baseBedLayouts, bedStatuses);

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

  // 병상 클릭 
  const BedCard = ({ bed }) => (
    <div 
      className={getBedClassName(bed.status)}
      onClick={() => handleBedClick(bed)}
      style={{ cursor: 'pointer' }}
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

  //응급실 병상 페이지 구조 
  return (
    <div className="medical-dashboard emergency-page">
      <div className="dashboard-content">
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
            <div className="emergency-area-label emergency-area-label-a">A구역</div>
            <div className="emergency-area-label emergency-area-label-b">B구역</div>

            <Quadrant data={quadrantData.quadrant2} className="emergency-quadrant-2" />
            <Quadrant data={quadrantData.quadrant1} className="emergency-quadrant-1" />
            <Quadrant data={quadrantData.quadrant3} className="emergency-quadrant-3" />
            <Quadrant data={quadrantData.quadrant4} className="emergency-quadrant-4" />

            <div className="emergency-partition-wall"></div>
            <div className="emergency-entrance">
              <div className="emergency-entrance-text">Entrance</div>
            </div>
            <div className="emergency-nurse-station">
              <div className="emergency-nurse-station-text">Nurse Station</div>
            </div>
          </div>
        </div>
        {/*  */}
        {showPatientModal && (
          <EmergencyModal 
            bed={selectedBed}
            patients={waitingPatients}
            onAssign={handlePatientAssign}
            onClose={closeModal}
          />
        )}
        {/* 퇴실 모달 */}
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