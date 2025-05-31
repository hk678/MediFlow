import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [ck, setCk] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/controller/api/hello', {
      params: { ck: '클릭됨' }
    })
      .then((res) => {
        console.log(res.data);
        setCk(res.data);
      })
      .catch(err => console.error(err));
  }, []); // 의존성 배열이 비어있으면 최초 한 번만 실행

  return (
    <div>
      <p onClick={(e) => {
        // 클릭 시 API 요청 보내도록 변경 가능
        axios.get('http://localhost:8081/api/hello', {
          params: { ck: e.target.innerText }
        })
          .then(res => setCk(res.data))
          .catch(err => console.error(err));
      }}>
        이걸 클릭
      </p>
      <h1>{ck}</h1>
    </div>
  );
}

export default App;
