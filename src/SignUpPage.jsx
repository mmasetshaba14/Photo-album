import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate for route navigation
import { Link } from 'react-router-dom'; // Import Link for navigation to login page

const SignUpPage = () => {
  const [Email, setEmail] = useState('');
  const [FullName, setFullName] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Indicates if the form is submitting
  const navigate = useNavigate(); // Using useNavigate hook

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://lcw6cbmvai.execute-api.eu-west-1.amazonaws.com/prod', // Replace with your actual endpoint
        {
          FullName: FullName,  // Capitalized key
          Email: Email,        // Capitalized key
          Password: Password,   // Match backend expectation (camelCase)
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.status === 200) {
        alert('Sign up successful!');
        navigate('/login'); // Redirect to login page
      } else {
        alert('Error: ' + response.data.message || 'Unknown error');
      }
    } catch (error) {
      setLoading(false);

      // Logging error details to help debug
      console.error('SignUp Error:', error);

      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        alert(`Error: ${error.response.data.message || 'Unknown server error'}`);
      } else if (error.request) {
        alert('Network error: Please check your internet connection or try again later.');
      } else {
        alert('Error occurred while setting up the request.');
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="card p-5"
        style={{
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          {/* Full Name Input */}
          <div className="form-group">
            <label htmlFor="FullName">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="FullName"
              placeholder="Enter full name"
              value={FullName}
              onChange={(e) => setFullName(e.target.value)} // Controlled input
              required
            />
          </div>

          {/* Email Input */}
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
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>

          {/* Password Input */}
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
          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg"
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Signing up...' : 'Submit'}
          </button>

          {/* Link to Login Page */}
          <p className="mt-3 text-center">
            Already have an account?{' '}
            <Link to="/login" className="btn btn-link">
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
