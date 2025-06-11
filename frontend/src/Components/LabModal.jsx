import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Style/LabModal.css';

const LabModal = ({ visitId, isOpen, onClose }) => {
  const [labResults, setLabResults] = useState([]);

  useEffect(() => {
    if (isOpen && visitId) {
      axios.get(`http://localhost:8081/api/visits/${visitId}/labs`)
      .then(res => {
        console.log("전체 검사 데이터", res.data);
        setLabResults(res.data)
      })     
        .catch(err => {
          console.error('검사 결과 불러오기 실패:', err);
          setLabResults([]);
        });
    }
  }, [isOpen, visitId]);

  if (!isOpen) return null;

  return (
    <div className="lab-modal-overlay">
      <div className="lab-modal">
        {/* 제목과 닫기 버튼 같은 줄 */}
        <div className="lab-modal-header">
          <h2>검사 결과</h2>
          <button className="close-button3" onClick={onClose}>닫기</button>
        </div>
        <div className="lab-table-wrapper">
          <table className="lab-table">
            <thead>
              <tr>
                <th>검사시간</th>
                <th>WBC</th>
                <th>Hb</th>
                <th>PLT</th>
                <th>Na</th>
                <th>K</th>
                <th>Cr</th>
                <th>CRP</th>
                <th>Albumin</th>
                <th>ALT</th>
                <th>Ammonia</th>
                <th>AP</th>
                <th>AST</th>
                <th>BHB</th>
                <th>Bilirubin</th>
                <th>Ca</th>
                <th>Chloride</th>
                <th>D-Dimer</th>
                <th>GGT</th>
                <th>Glucose</th>
                <th>INR(PT)</th>
                <th>Lactate</th>
                <th>LD</th>
                <th>Mg</th>
                <th>PT</th>
                <th>PTT</th>
                <th>RBC</th>
                <th>ESR</th>
                <th>BUN</th>
              </tr>
            </thead>
            <tbody>
              {labResults.map((lab, index) => (
                <tr key={index}>
                  <td>{lab.labTime?.replace('T', ' ').slice(0, 16)}</td>
                  <td>{lab.wbc}</td>
                  <td>{lab.hemoglobin}</td>
                  <td>{lab.plateletCount}</td>
                  <td>{lab.na}</td>
                  <td>{lab.k}</td>
                  <td>{lab.creatinine}</td>
                  <td>{lab.crp}</td>
                  <td>{lab.albumin}</td>
                  <td>{lab.alt}</td>
                  <td>{lab.ammonia}</td>
                  <td>{lab.ap}</td>
                  <td>{lab.ast}</td>
                  <td>{lab.bhb}</td>
                  <td>{lab.bilirubin}</td>
                  <td>{lab.ca}</td>
                  <td>{lab.chloride}</td>
                  <td>{lab.ddimer}</td>
                  <td>{lab.ggt}</td>
                  <td>{lab.glucose}</td>
                  <td>{lab.inrPt}</td>
                  <td>{lab.lactate}</td>
                  <td>{lab.ld}</td>
                  <td>{lab.mg}</td>
                  <td>{lab.pt}</td>
                  <td>{lab.ptt}</td>
                  <td>{lab.redBloodCells}</td>
                  <td>{lab.sedimentationRate}</td>
                  <td>{lab.ureaNitrogen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabModal;
