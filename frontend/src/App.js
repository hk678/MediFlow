import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/Login';
import MainPage from './Pages/MainPage';
import Detail from './Pages/Detail';
import Admin from './Pages/Admin';
import History from './Components/History';
import UserInfo from './Components/UserInfo';
import UserUpdate from './Components/UserUpdate';

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