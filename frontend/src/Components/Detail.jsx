import React, { useState, useEffect } from "react";
import "../Style/Detail.css";
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from "axios";

function Detail() {
  const [history, setHistory] = useState(null);
  const { pid } = useParams();
  const location = useLocation();
  const { name, age, sex, visitId} = location.state || {};
  const [historyData, setHistoryData] = useState([]);
  const [info, setInfo] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);

  const navigate = useNavigate();

  
  
  // 좌측 패널 토글 상태
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  // 인포 부분 만들기
  useEffect(() => {
    axios.get(`http://localhost:8081/api/visits/${pid}`)
      .then((res) => {
        console.log(res.data[0]); //  visitId 포함 확인
        setInfo(res.data[0]);
        setPatientInfo(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, [pid]);


  // 인포 끗 -----


  //히스토리 띄우기
    useEffect(() => {
    if (visitId) {
      axios
        .get(`http://localhost:8081/api/visits/${visitId}/history`)
        .then((res) => setHistoryData(res.data))
        .catch((err) => console.error("히스토리 불러오기 실패", err));
    }
  }, [visitId]);



  // 샘플 데이터
  // const patientInfo = {
  //   date: "2025-08-06",
  //   adm: "38967799",
  //   bed: "A05",
  //   ktas: "2",
  //   pain: "7",
  //   chiefComplaint: "Chest pain",
  //   arrivalTransport: "UNKNOWN"
  // };
  


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
                <button className="btn-primary">과거기록</button>
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
                    <div className="figure-center">65</div>
                  </div>
                  <button className="disposition-btn-success">최종 배치</button>
                </div>
                <div className="prediction-info">
                  <div className="prediction-item">
                    <span className="label">입실 시 예측:</span>
                    <span className="value">귀가</span>
                  </div>
                  <div className="prediction-item">
                    <span className="label">퇴실 시 예측:</span>
                    <span className="value">일반 병동</span>
                    <span className="sub-value">(가용 병상 수: 1/20)</span>
                  </div>
                  <div className="prediction-item">
                    <span className="label">예측 근거:</span>
                    <span className="value">LLM이 왜 이렇게 최종 배치를 예측했는지 이유를 알려주는 블록</span>
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
            {/* 실험 끗 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;