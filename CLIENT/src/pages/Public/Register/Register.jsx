import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    role: 'user', // Default role
  });
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const { email, password, firstName, lastName, contactNo } = formData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !contactNo) {
      alert('All required fields must be filled out!');
      return;
    }

    setStatus('loading');
    try {
      // Register the user
      await axios.post('/user/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Log the user in after successful registration
      const response = await axios.post(
        '/user/login',
        { email, password },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );

      // Save access token and navigate to home
      localStorage.setItem('accessToken', response.data.access_token);
      alert('Registration successful! Logging you in...');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="Register">
      <div className="main-container">
        <h3>Register</h3>
        <form>
          <div className="form-containerg">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                required
                placeholder='Email'
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleOnChange}
                required
                placeholder='password'
              />
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleOnChange}
                required
                placeholder='First Name'
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleOnChange}
                required
                placeholder='Last Name'
              />
            </div>
            <div className="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleOnChange}
                placeholder='Middle Name'
              />
            </div>
            <div className="form-group">
              <label>Contact No:</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleOnChange}
                required
                placeholder='Contact No'
              />
            </div>
            <div className="submit-container">
              <button
                className="btn-register"
                type="button"
                onClick={handleRegister}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Registering...' : 'Register'}
              </button>
            </div>
            <div className="reg-container">
              <small>Already have an account? </small>
              <a href="/login">
                <small>Log In</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
