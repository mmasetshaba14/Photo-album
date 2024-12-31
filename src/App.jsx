import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './SignUpPage';  // Your signup page component
import LoginPage from './LoginPage';    // Your login page component
import Dashboard from './Dashboard';    // Your dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect from root ("/") to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
