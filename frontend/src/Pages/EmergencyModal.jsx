import React, { useState, useEffect } from "react";
import { X, User, Clock, AlertCircle } from "lucide-react";
import axios from "axios";
import '../Style/Emergencymodal.css';

// KTAS 등급과 Label에 따른 병상 상태 결정 (수정된 버전)
// const getBedStatusFromKTAS = (ktas, label) => {
//   // 1순위: label 필드가 있으면 우선 사용
//   if (label !== undefined && label !== null) {
//     switch (label) {
//       case 1: // 위험
//         return 'red';
//       case 0: // 주의  
//         return 'yellow';
//       case -1: // 경미
//         return 'green';
//       default:
//         // label이 있지만 알 수 없는 값인 경우 KTAS로 fallback
//         break;
//     }
//   }

// 2순위: KTAS 값으로 판단
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

const EmergencyModal = ({ bed, patients, onAssign, onClose }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // ESC 키로 모달 닫기 기능
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // 이벤트 리스너 추가
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // 모달 오버레이 클릭 시 닫기
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 환자 필터링 (검색어 기반) - 안전한 필터링으로 수정
  const filteredPatients = patients.filter(patient =>
    (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.complaint || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.pid || '').includes(searchTerm)
  );

  // KTAS 레벨에 따른 우선순위 정렬
  const sortedPatients = filteredPatients.sort((a, b) => a.ktas - b.ktas);

  // 환자 선택 핸들러
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  // 환자 배치 - 백엔드 연동
  const handleAssignConfirm = async () => {
    if (!selectedPatient) return;

    setIsAssigning(true);

    try {
      console.log('배치 시작:', {
        patient: selectedPatient.name,
        bed: bed?.name,
        visitId: selectedPatient.visitId
      });

      // 1. AI 예측 실행 (선택사항 - 환자 데이터가 있는 경우)
      if (selectedPatient.visitId) {
        try {
          await axios.post(`http://localhost:8081/api/visits/${selectedPatient.visitId}/predict/admission`);
          console.log('AI 예측 완료');
        } catch (aiError) {
          console.warn('AI 예측 실패:', aiError.message);
        }
      }

      // 2. 병상 유형에 따른 disposition 결정
      let disposition = 1; // 기본값: 일반병동

      if (bed?.name?.startsWith('B')) {
        disposition = 2; // ICU
      }

      // 3. 병상 배치 API 호출
      const assignmentData = {
        disposition: disposition,
        bedNumber: bed?.name,
        reason: `응급실 ${bed?.name} 병상 배치 - ${selectedPatient.name} 환자`
      };

      if (selectedPatient.visitId) {
        await axios.post(
          `http://localhost:8081/api/visits/${selectedPatient.visitId}/disposition`,
          assignmentData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
      }

      // 4. 성공 메시지 및 UI 업데이트
      alert(`${selectedPatient.name} 환자가 ${bed?.name} 병상에 성공적으로 배치되었습니다.`);

      // 5. 새로운 병상 상태 데이터 생성
      const newBedStatus = {
        patientId: selectedPatient.pid,
        patientName: selectedPatient.name,
        visitId: selectedPatient.visitId,
        ktas: selectedPatient.ktas,
        status: getBedStatusFromKTAS(selectedPatient.ktas),
        age: selectedPatient.age,
        gender: selectedPatient.sex,
        chiefComplaint: selectedPatient.complaint
      };

      // 6. 부모 컴포넌트에 새 병상 상태 전달
      if (onAssign) {
        onAssign(selectedPatient, bed?.name, newBedStatus);
      }

      // 7. 모달 닫기
      onClose();

    } catch (error) {
      console.error('환자 배치 실패:', error);

      let errorText = '환자 배치에 실패했습니다.';

      if (error.response?.status === 404) {
        errorText = '환자 정보를 찾을 수 없습니다.';
      } else if (error.response?.status === 400) {
        errorText = '잘못된 배치 요청입니다.';
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }

      alert(errorText);

    } finally {
      setIsAssigning(false);
    }
  };

  // KTAS 레벨에 따른 스타일 클래스
  const getKtasClass = (ktas) => {
    if (ktas <= 2) return 'ktas-critical';
    if (ktas === 3) return 'ktas-urgent';
    if (ktas === 4) return 'ktas-semi-urgent';
    return 'ktas-non-urgent';
  };

  // KTAS 레벨 텍스트
  const getKtasText = (ktas) => {
    switch (ktas) {
      case 1: return '소생';
      case 2: return '응급';
      case 3: return '긴급';
      case 4: return '준긴급';
      case 5: return '비응급';
      default: return '미분류';
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="patient-select-modal">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <div className="modal-title">
            <h3>환자 배치 - 병상 {bed?.name}</h3>
          </div>
          <button className="close-button" onClick={onClose}>
            <X className="close-icon" />
          </button>
        </div>

        {/* 검색바 */}
        <div className="patient-search-section">
          <div className="patient-search-container">
            <input
              type="text"
              placeholder="환자명, 환자번호, 주요증상으로 검색..."
              className="patient-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 환자 목록 */}
        <div className="patients-list">
          <div className="list-header">
            <span className="list-header-text">대기 환자 목록 ({sortedPatients.length}명)</span>
            <span className="priority-note">
              <AlertCircle className="warning-icon" />
              KTAS 순으로 정렬됨
            </span>
          </div>

          <div className="patients-container">
            {sortedPatients.length === 0 ? (
              <div className="no-patients">
                <p>검색 조건에 맞는 대기 환자가 없습니다.</p>
              </div>
            ) : (
              sortedPatients.map((patient) => (
                <div
                  key={patient.pid}
                  className={`patient-item ${selectedPatient?.pid === patient.pid ? 'selected' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="patient-main-info">
                    <div className="patient-details">
                      <div className="patient-name-id">
                        <span className="patient-name">{patient.name}</span>
                        <span className="patient-id">#{patient.pid}</span>
                      </div>
                      <div className="patient-basic">
                        <span className="age-sex">{patient.age}세 | {patient.sex}</span>
                        <span className="complaint">{patient.complaint}</span>
                      </div>
                    </div>

                    <div className="patient-status">
                      <div className={`ktas-badge ${getKtasClass(patient.ktas)}`}>
                        KTAS {patient.ktas}
                        <span className="emergency-ktas-text">{getKtasText(patient.ktas)}</span>
                      </div>
                      <div className="waiting-time">
                        <Clock className="clock-icon" />
                        <span>대기시간: {patient.waitingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 모달 푸터 - 버튼들 */}
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button
            className="assign-button"
            onClick={handleAssignConfirm}
            disabled={!selectedPatient || isAssigning}
          >
            {isAssigning ? '배치 중...' : '배치하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;