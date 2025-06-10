import React, { useState, useEffect } from "react";
import "../Style/Detail.css";
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from "axios";
import PastRecordModal from './PastRecordModal'; 

function Detail() {
  const [history, setHistory] = useState(null);
  const { pid } = useParams();
  const location = useLocation();
  const { name, age, sex, visitId} = location.state || {};
  const [historyData, setHistoryData] = useState([]);
  const [info, setInfo] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState('');
  const [predictionReason, setPredictionReason] = useState('');
  const [predictionScore, setPredictionScore] = useState('');
  const [dischargePrediction, setDischargePrediction] = useState('');
  const [dischargeReason, setDischargeReason] = useState('');
  const [bedInfo,setBedInfo] = useState('');

  // 최종 예측 
// 실험 한번
  const sendFinal = (visitId,dischargePrediction,dischargeReason) => {
    axios.post(`http://localhost:8081/api/visits/${visitId}/disposition`, {
      disposition: dischargePrediction,
      reason: dischargeReason
    }).then(res=>{
      console.log("최종배치 확인",res)
      console.log("visitId 타입 확인:", typeof visitId, visitId);
    }).catch(err=>{
      console.error("실패",err);
      console.log("visitId 타입 확인:", typeof visitId, visitId);
    });
  };


  // 최종 예측 끝 ----
  // 2차 예측
  useEffect(() => {
    if (visitId) {
      axios.post(`http://localhost:8081/api/visits/${visitId}/predict/discharge`)
      .then(res => {
        console.log("퇴실 예측 응답:", res.data);
        setDischargePrediction(res.data.preDisposition);
        setDischargeReason(res.data.reason);
      })
      .catch(err => {
        console.error("퇴실 예측 실패:", err);
        setDischargePrediction('예측 실패');
      });
    }
  }, [visitId]);
  
  const renderDischargePrediction = () => {
    if (dischargePrediction === '') return '예측 중...';
    switch (String(dischargePrediction)) {
      case '0': return '귀가';
      case '1': return '일반 병동';
      case '2': return '중환자실';
      default: return `${dischargePrediction}`;
    }
  };
  
  
  // 1차 예측 
  
  useEffect(() => {
    if (visitId) {
      axios.post(`http://localhost:8081/api/visits/${visitId}/predict/admission`)
      .then(res => {
        console.log("예측 응답:", res.data.preDisposition); //  응답 결과 로그
        console.log("전체 예측 응답:", res.data);
        setPrediction(res.data.preDisposition); // 0,1,2 로 불러와짐
        setPredictionReason(res.data.reason);
        setPredictionScore(res.data.preScore);
      })
      .catch(err => {
        console.error('예측 실패:', err);
        setPrediction('예측 실패');
      });
    }
  }, [visitId]);
  
  // 알기쉽게 변환환
  const renderPrediction = () => {
    if (prediction === '') return '예측 중...';
    switch (String(prediction)) {
      case '0':
        return '귀가';
        case '1':
          return '일반 병동';
          case '2':
            return '중환자실';
            default:
              return `${prediction}`;
            }
          };
          
          // 1차 예측 끝끝
          
          // 병상 들고오기
          useEffect((visitId)=>{
            axios.get(`http://localhost:8081/api/visits/${visitId}/available-beds`)
              .then(res=>{
                console.log("침대 확인",res.data.availableCount)
                setBedInfo(res.data.availableCount);
              })
          },[visitId]);
          
          // 과거기록 버튼
          const [showPastRecordModal, setShowPastRecordModal] = useState(false);
          
          // 🎯 과거 기록 존재 여부 상태 추가
  const [hasPastRecords, setHasPastRecords] = useState(false); // null: 확인 중, true/false: 결과
  const [checkingPastRecords, setCheckingPastRecords] = useState(true);

  
  // 좌측 패널 토글 상태
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  // 인포 부분 만들기 - 
  useEffect(() => {
    axios.get(`http://localhost:8081/api/visits/${pid}`)
      .then((res) => {
        console.log(res.data[0]); //  visitId 포함 확인
        setInfo(res.data[0]);
        setPatientInfo(res.data[0]);

        // 과거 기록 존재 여부 확인
        const hasRecords = res.data && res.data.length > 0;
        setHasPastRecords(hasRecords);
        setCheckingPastRecords(false);
      })
      .catch((err) => {
        console.error(err);
        // 에러 시, 과거 기록 비활성화
        setHasPastRecords(false);
        setCheckingPastRecords(false);
        });
  }, [pid]);



  // 인포 부분 끝 -----------------------------------------------


  //히스토리 띄우기
    useEffect(() => {
    if (visitId) {
      axios
        .get(`http://localhost:8081/api/visits/${visitId}/history`)
        .then((res) => setHistoryData(res.data))
        .catch((err) => console.error("히스토리 불러오기 실패", err));
    }
  }, [visitId]);

  // 과거 기록 모달창 함수
  const handlePastRecordClick = () => {
    if (hasPastRecords && !checkingPastRecords) {
      setShowPastRecordModal(true);
    }
  };



  return (
    <div className="detail-page">
      {/* 메인 컨텐츠 */}
      <div className={`detail-content ${!isLeftPanelOpen ? 'left-panel-closed' : ''}`}>
        {/* 좌측 - 비정상 검사 결과 */}
        <div className={`left-section ${!isLeftPanelOpen ? 'collapsed' : ''}`}>
          {isLeftPanelOpen && (
            <>
              <h2 className="section-title">비정상 검사 결과</h2>
              
              {/* 첫 번째 검사 카드 */}
              <div className="test-card">
                <div className="test-header">
                  <span className="test-date">2025-08-07 13시 07분</span>
                </div>
                <div className="test-items">
                  <div className="test-item">
                    <div className="test-name">pCO2</div>
                    <div className="test-values">
                      <span className="range-low">35</span>
                      <span className="range-normal">45</span>
                      <span className="current-value high">47</span>
                    </div>
                    <div className="test-bars">
                      <div className="bar-section low">낮음</div>
                      <div className="bar-section normal">정상</div>
                      <div className="bar-section high active">높음</div>
                    </div>
                  </div>
                  <div className="test-item">
                    <div className="test-name">SBP</div>
                    <div className="test-values">
                      <span className="range-low">90</span>
                      <span className="range-normal">140</span>
                      <span className="current-value high">141</span>
                    </div>
                    <div className="test-bars">
                      <div className="bar-section low">낮음</div>
                      <div className="bar-section normal">정상</div>
                      <div className="bar-section high active">높음</div>
                    </div>
                  </div>
                </div>
                <div className="test-footer">
                  <span className="view-all">전체 혈액 검사 보기 &gt;</span>
                </div>
              </div>

              {/* 두 번째 검사 카드 */}
              <div className="test-card">
                <div className="test-header">
                  <span className="test-date">2025-08-06 01시31분</span>
                </div>
                <div className="test-items">
                  <div className="test-item">
                    <div className="test-name">pCO2</div>
                    <div className="test-values">
                      <span className="range-low">35</span>
                      <span className="range-normal">45</span>
                      <span className="current-value high">75</span>
                    </div>
                    <div className="test-bars">
                      <div className="bar-section low">낮음</div>
                      <div className="bar-section normal">정상</div>
                      <div className="bar-section high active">높음</div>
                    </div>
                  </div>
                  <div className="test-item">
                    <div className="test-name">SBP</div>
                    <div className="test-values">
                      <span className="range-low">90</span>
                      <span className="range-normal">140</span>
                      <span className="current-value high">150</span>
                    </div>
                    <div className="test-bars">
                      <div className="bar-section low">낮음</div>
                      <div className="bar-section normal">정상</div>
                      <div className="bar-section high active">높음</div>
                    </div>
                  </div>
                  <div className="test-item">
                    <div className="test-name">SpO2</div>
                    <div className="test-values">
                      <span className="range-low">95</span>
                      <span className="range-normal">100</span>
                      <span className="current-value low">92</span>
                    </div>
                    <div className="test-bars">
                      <div className="bar-section low active">낮음</div>
                      <div className="bar-section normal">정상</div>
                      <div className="bar-section high">높음</div>
                    </div>
                  </div>
                  <div className="test-item">
                    <div className="test-name">pH</div>
                    <div className="test-values">
                      <span className="range-low">7.35</span>
                      <span className="range-normal">7.45</span>
                      <span className="current-value low">7.31</span>
                    </div>
                    <div className="test-bars">
                      <div className="bar-section low active">낮음</div>
                      <div className="bar-section normal">정상</div>
                      <div className="bar-section high">높음</div>
                    </div>
                  </div>
                </div>
                <div className="test-footer">
                  <span className="view-all">전체 혈액 검사 보기 &gt;</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 토글 버튼 */}
        <div className="toggle-button-container">
          <button 
            className="panel-toggle-btn" 
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          >
            {isLeftPanelOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* 우측 전체 영역 */}
        <div className="right-container">
          {/* 상단 헤더 */}
          <div className="detail-header">
            <div className="header-left">
              <button className="back-button" onClick={() => navigate('/')}>
                <ArrowLeft className="back-icon" />
              </button>
              <div className="patient-title">
                <span className="patient-name">{name}</span>
                <span className="patient-info">{age}세 | {sex}</span>
              </div>
            </div>
            <div className="header-right">
              <div className="doctor-info">
                <User className="doctor-icon" />
                <span className="doctor-name">의사이도은</span>
              </div>
              <button className="logout-btn">Logout</button>
            </div>
          </div>

          {/* 우측 - 상세 정보 */}
          <div className="right-section">
            {/* Information 섹션 */}
            <div className="info-section">
              <div className="section-header">
                <h3>Information</h3>
                {/* 과거 기록 여부에 따른 버튼 활성화&비활성화 */}
                <button 
                  className={`btn-primary ${(!hasPastRecords || checkingPastRecords) ? 'btn-disabled' : ''}`}
                  onClick={handlePastRecordClick}
                  disabled={!hasPastRecords || checkingPastRecords}
                  title={checkingPastRecords ? '과거 기록 확인 중...' : 
                         !hasPastRecords ? '과거 기록이 없습니다' : '과거 기록 보기'}
                >
                  {checkingPastRecords ? '확인 중...' : '과거기록'}
                </button>
              </div>
              <div className="info-table">
                <div className="info-table-header">
                  <span>Date</span>
                  <span>ADM</span>
                  <span>Bed</span>
                  <span>Pain</span>
                  <span>Chief Complaint</span>
                  <span>Arrival Transport</span>
                </div>
                <div className="info-table-row">
                  <span>{patientInfo?.admissionTime}</span>
                  <span>{patientInfo?.visitId}</span>
                  <span>{patientInfo?.bedNumber}</span>
                  <span>{patientInfo?.pain}</span>
                  <span>{patientInfo?.chiefComplaint}</span>
                  <span>{patientInfo?.arrivalTransport}</span>
                </div>
              </div>
            </div>

            {/* Disposition 섹션 */}
            <div className="disposition-section">
              <h3>Disposition</h3>
              <div className="disposition-content">
                <div className="figure-container">
                  <div className="figure-chart">
                    <div className="figure-needle"></div>
                    <div className="figure-center">{predictionScore}</div>
                  </div>
                  <button className="disposition-btn-success" onClick={() => sendFinal(visitId, dischargePrediction, dischargeReason)}>최종 배치</button>
                </div>
                <div className="prediction-info">
                  <div className="prediction-item">
                    <span className="label">입실 시 예측:</span>
                    <span className="value">{renderPrediction()}</span>
                  </div>
                  <div className="prediction-item">
                    <span className="label">퇴실 시 예측:</span>
                    <span className="value">{renderDischargePrediction()}</span>
                    <span className="sub-value">(가용 병상 수: {bedInfo}/20)</span>
                  </div>
                  <div className="prediction-item">
                    <span className="label">예측 근거:</span>
                    <span className="value">{predictionReason}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* History 섹션 */}
            <div className="history-section">
              <h3>History</h3>
              <div className="history-table">
                <div className="history-table-header">
                  <span>Number</span>
                  <span>Created time</span>
                  <span>Content</span>
                </div>
            {/* 실험 시작 */}
                {historyData.length > 0 ? (
                  historyData.map((item, idx) => (
                    <div key={idx} className="history-table-row">
                      <span>{item.number || idx + 1}</span>
                      <span>{item.recordTime}</span>
                      <span>{item.content}</span>
                    </div>
                  ))
                ) : (
                  <div className="history-table-row">
                    <span colSpan="3">과거 기록이 없습니다.</span>
                  </div>
                )}
            {/* 실험 종료 */}

            {/* 과거 기록 모달창 */}
            {showPastRecordModal && (
              <PastRecordModal
                patientName={name}
                patientPid={pid}
                onClose={() => setShowPastRecordModal(false)}
              />
            )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;