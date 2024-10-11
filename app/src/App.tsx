// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthSignIn from './pages/AuthSignIn';
import AuthSignUp from './pages/AuthSignUp';
import Index from './pages/Index';
import PageFiles from './pages/PageFiles';
import PrivateRoute from './components/PrivateRoute';
import { isTokenValid } from './components/TokenValidator';



function App() {
  const token = localStorage.getItem('token');
  const isTokenValidClientSide = isTokenValid(token);


  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isTokenValidClientSide ? <AuthSignIn />: <Navigate to="/"/>} />
        <Route path="/register" element={!isTokenValidClientSide ? <AuthSignUp />: <Navigate to="/"/>} />
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/files" element={<PrivateRoute><PageFiles /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
