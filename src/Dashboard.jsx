import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('addPhotoTab');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve email from localStorage
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('activeTab', tabName);
  };

  const handleLogout = () => {
    setUserEmail('');
    localStorage.removeItem('userEmail'); // Clear the saved email
    localStorage.removeItem('activeTab'); // Clear the saved tab
    navigate('/login'); // Redirect to login page
  };

  const handleFileChange = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedPhoto) {
      alert('Please select a photo to upload');
      return;
    }

    setIsLoading(true);

    try {
      const fileBase64 = await convertToBase64(selectedPhoto);

      const data = {
        email: userEmail, 
        file: fileBase64.split(',')[1],
        contentType: selectedPhoto.type,
      };

        console.log("Payload being sent:", data);
      
      const response = await axios.put(
        'https://htnsrwbav8.execute-api.eu-west-1.amazonaws.com/prod/dev',
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setPhotos([...photos, response.data.fileUrl]);
      alert('Photo uploaded successfully!');
      setSelectedPhoto(null);
      document.getElementById('photoUpload').value = '';
    } catch (error) {
      console.error('Error uploading photo:', error.response?.data || error.message);
      alert(`Error uploading photo: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`https://mclk5hi2qh.execute-api.eu-west-1.amazonaws.com/prod/dev?email=${userEmail}`);

      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error('Error fetching photos:', error.response?.data || error.message);
      
    }
  };

  useEffect(() => {
    if (activeTab === 'viewPhotosTab') {
      fetchPhotos();
    }
  }, [activeTab]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Album</h2>

      {/* Display user email */}
      {userEmail && (
        <p className="text-center"> <strong>{userEmail}</strong></p>
      )}

      <div className="card p-4 border">
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#albumTab" style={{ pointerEvents: 'none' }}>
              Album
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'addPhotoTab' ? 'active' : ''}`}
              onClick={() => handleTabChange('addPhotoTab')}
              href="#addPhotoTab"
            >
              Add Photos
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'viewPhotosTab' ? 'active' : ''}`}
              onClick={() => handleTabChange('viewPhotosTab')}
              href="#viewPhotosTab"
            >
              View Photos
            </a>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content mt-3">
          {/* Add Photo Tab */}
          {activeTab === 'addPhotoTab' && (
            <div className="tab-pane fade show active" id="addPhotoTab">
              <h3>Add Photo</h3>
              <form onSubmit={handleUpload}>
                <div className="mb-3">
                  <label htmlFor="photoUpload" className="form-label">Choose a photo</label>
                  <input
                    type="file"
                    className="form-control"
                    id="photoUpload"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-secondary"
                  >
                    Log Out
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* View Photos Tab */}
          {activeTab === 'viewPhotosTab' && (
            <div className="tab-pane fade show active" id="viewPhotosTab">
              <h3>Photos</h3>
              <div className="row">
                {photos.length === 0 ? (
                  <p className="text-center w-100"></p>
                ) : (
                  photos.map((photo, index) => (
                    <div className="col-12 col-sm-6 col-md-4 mb-3" key={index}>
                      <div className="card">
                        <img
                          src={photo}
                          className="card-img-top img-fluid"
                          alt={`Uploaded ${index + 1}`}
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-primary"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
