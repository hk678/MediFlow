import React, { useState, useEffect } from "react";
import { X, User, Clock, AlertCircle } from "lucide-react";
import '../Style/Emergencymodal.css';

const EmergencyModal = ({ bed, patients, onAssign, onClose }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ESC 키로 모달 닫기 기능
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // 이벤트 리스너 추가
    document.addEventListener('keydown', handleEscapeKey);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // 모달 오버레이 클릭 시 닫기
  const handleOverlayClick = (event) => {
    // 모달 내부 클릭 시에는 닫지 않음
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 환자 필터링 (검색어 기반)
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pid.includes(searchTerm)
  );

  // KTAS 레벨에 따른 우선순위 정렬
  const sortedPatients = filteredPatients.sort((a, b) => a.ktas - b.ktas);

  // 환자 선택 핸들러
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  // 배치 확인
  const handleAssignConfirm = () => {
    if (selectedPatient) {
      onAssign(selectedPatient);
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
    switch(ktas) {
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
            <p className="bed-info">배치할 환자를 선택해주세요 (ESC로 닫기)</p>
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
                        <span className="ktas-text">{getKtasText(patient.ktas)}</span>
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
            disabled={!selectedPatient}
          >
            배치하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;