
import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import './App.css';
import MainPage from './Components/MainPage';
import Detail from './Components/Detail';
import Admin from './Components/Admin';
import History from './Components/History';
import UserInfo from './Components/UserInfo';
import UserUpdate from './Components/UserUpdate'
import EmergencyRoom from './Components/EmergencyRoom';


function App() {
  return (
    <div className="App">
      {/* 메인 페이지 
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="emergency" element={<EmergencyRoom />} />
          <Route path="/detail/:pid" element={<Detail />} />
          <Route path="/history/:pid" element={<History />} />
        </Routes>
      </Router> */}
      

      {/* 상세 페이지지 
      <Detail /> */}

      {/* 관리자 페이지 */}
      <Admin /> 

      {/* 히스토리리 페이지 
      <History />*/}

      
      {/* 환자정보 입력 페이지 
      <UserInfo /> */}

      {/* 사용자 정보 업데이트 
      <UserUpdate/> */}
    </div>
  );
}

export default App;
