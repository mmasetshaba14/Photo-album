import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Link, useNavigate } from 'react-router-dom'; // For navigation

const LoginPage = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Indicates if the form is submitting
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Reset error message

    localStorage.setItem('userEmail', Email);

    try {
      const response = await axios.post(
        'https://zovk115zd3.execute-api.eu-west-1.amazonaws.com/prod',  // Update with your login endpoint
        { Email, Password }
      );

      if (response.status === 200) {
        
        // Redirect to the dashboard page after successful login
        navigate('/dashboard'); // Navigate to dashboard
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5" style={{ width: '100%', maxWidth: '500px', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
        <h2 className="text-center mb-4">Login Page</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)} // Controlled input
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)} // Controlled input
              required
            />
          </div>

          <div className="mb-4"></div>
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          
          <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="mt-3 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="btn btn-link">
              Create one here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
