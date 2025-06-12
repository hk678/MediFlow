import React, { useState } from 'react';
import '../Style/FinalizeModal.css'; // 스타일 분리

function FinalizeModal({ prediction, onClose, onConfirm,reason }) {
  const [selectedValue, setSelectedValue] = useState(String(prediction)); // 초기값은 예측값

  const handleConfirm = () => {
    onConfirm(selectedValue, reason); // 이유(reason) 없이 값만 전달
  };

  return (
    <div className="finalize-modal-overlay">
      <div className="finalize-modal">
        <h3>최종 배치 확인</h3>
        <p>예측 결과: <strong>{renderDisposition(prediction)}</strong></p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="0"
              checked={selectedValue === '0'}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            귀가
          </label>
          <label>
            <input
              type="radio"
              value="1"
              checked={selectedValue === '1'}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            일반 병동
          </label>
          <label>
            <input
              type="radio"
              value="2"
              checked={selectedValue === '2'}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            중환자실
          </label>
        </div>
        <div className="modal-buttons">
          <button onClick={handleConfirm}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

const renderDisposition = (val) => {
  switch (String(val)) {
    case '0': return '귀가';
    case '1': return '일반 병동';
    case '2': return '중환자실';
    default: return '알 수 없음';
  }
};

export default FinalizeModal;
