import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30); // Track remaining time
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isBlocked && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime <= 0) {
      clearInterval(timer);
      setIsBlocked(false);
      setLoginAttempts(0);
      setRemainingTime(30);
    }
    return () => clearInterval(timer);
  }, [isBlocked, remainingTime]);

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setError('');
  };

  const validateFields = () => {
    const { email, password } = formState;
    return email.trim() && password.trim();
  };

  const handleLogin = async () => {
    if (isBlocked) {
      setError('You are blocked. Please wait for the countdown to complete.');
      return;
    }

    if (!validateFields()) {
      setError('Both email and password are required!');
      if (!formState.email) emailRef.current.focus();
      if (!formState.password) passwordRef.current.focus();
      return;
    }

    setStatus('loading');
    try {
      const response = await axios.post('/user/login', formState);
      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/home');
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      if (loginAttempts + 1 >= 3) {
        setIsBlocked(true);
        setError('Too many failed attempts. You are blocked for 30 seconds.');
      } else {
        setError(`Invalid credentials. You have ${2 - loginAttempts} attempts left.`);
      }
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Login</h3>
        <form>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="text"
                id="email"
                name="email"
                ref={emailRef}
                value={formState.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                disabled={isBlocked}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                name="password"
                ref={passwordRef}
                value={formState.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                disabled={isBlocked}
              />
            </div>
            <div
              className="show-password"
              onClick={handleShowPassword}
              aria-label="Toggle password visibility"
            >
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>
            {error && <div className="error-message">{error}</div>}

            {isBlocked && (
              <div className="countdown-container">
                <p>You are blocked. Try again in:</p>
                <div className="countdown">
                  <span>{remainingTime}s</span>
                  <div
                    className="progress-bar"
                    style={{ width: `${(remainingTime / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="submit-container">
              <button
                className="btn-primary"
                type="button"
                disabled={status === 'loading' || isBlocked}
                onClick={handleLogin}
              >
                {status === 'loading' ? 'Logging in...' : isBlocked ? 'Blocked' : 'Login'}
              </button>
            </div>

            <div className="register-container">
              <small>Don't have an account? </small>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
