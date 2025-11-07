/*
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetailTodo from "./Routes/DetailTodo";
import Detail from "./Routes/Detail";
import Home from "./Routes/Home";
import LandingPage from "./Routes/LandingPage";
import SignupPage from "./Routes/SignupPage";
import LoginPage from "./Routes/LoginPage";
import Store from "./Routes/Store";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/project/:id" element={<Detail />}/>
        <Route path="/project/:id/:id2" element={<DetailTodo />}/>
      </Routes>
    </Router>
  );
}

export default App;

*/

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import DetailTodo from "./presentation/pages/DetailTodo";
import Detail from "./presentation/pages/Detail";
import Home from "./presentation/pages/Home";
import LandingPage from "./presentation/pages/LandingPage";
import SignupPage from "./presentation/pages/SignupPage";
import LoginPage from "./presentation/pages/LoginPage";
import Store from "./presentation/pages/Store";
import { AuthProvider, useAuth } from "./presentation/hooks/useAuth";
import ErrorBoundary from "./presentation/components/ErrorBoundary";


// 인증 상태에 따른 라우팅 컴포넌트
function AppRoutes() {
  const { user, isLoading } = useAuth();

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(180deg, #0A0F33 0%, #1E2D99 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <Routes>
      {/* 인증되지 않은 사용자는 랜딩 페이지로 */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/home" replace /> : <LandingPage />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/home" replace /> : <SignupPage />} 
      />
      
      {/* 인증된 사용자만 접근 가능한 페이지들 */}
      <Route 
        path="/home" 
        element={user ? <Home /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/store" 
        element={user ? <Store /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/project/:projectId" 
        element={user ? <Detail /> : <Navigate to="/" replace />} 
      />
      
      {/* 존재하지 않는 경로는 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;