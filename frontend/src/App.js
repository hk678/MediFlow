import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';
import MainPage from './Components/MainPage';
import Detail from './Components/Detail';
import Admin from './Components/Admin';
import History from './Components/History';
import UserInfo from './Components/UserInfo';
import UserUpdate from './Components/UserUpdate';
import EmergencyRoom from './Components/EmergencyRoom';



// function App() {
//   return (
//     <div className="App">
//       <AuthProvider> {/* 이건 유지 */}
//         <Router>
//           <Routes>
//             <Route path="/" element={<MainPage />} />
//             <Route path="/emergency" element={<EmergencyRoom />} />
//             <Route path="/detail/:pid" element={<Detail />} />
//             <Route path="/history/:pid" element={<History />} />
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </div>
//   );
// }
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            {/* 로그인 페이지 (인증 불필요) */}
            <Route path="/login" element={<Login />} />

            
            {/* 보호된 라우트들 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute>
                  <EmergencyRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail/:pid"
              element={
                <ProtectedRoute>
                  <Detail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/:pid"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userinfo"
              element={
                <ProtectedRoute>
                  <UserInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userupdate/:pid"
              element={
                <ProtectedRoute>
                  <UserUpdate />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}


export default App;