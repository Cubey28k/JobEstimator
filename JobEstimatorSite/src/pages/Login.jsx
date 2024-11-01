import React, { useState, useContext, useEffect } from 'react';
import { Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

function Login() {
  const { login, registerUser, isAuthenticated } = useContext(AuthContext); // Added registerUser here
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/estimate');
    }
  }, [isAuthenticated, navigate]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login({ username, password });
      if (success) {
        navigate('/estimate');
      }
    } catch (e) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', e);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate all required fields
    if (!username || !email || !password || !securityQuestion || !securityAnswer) {
      setError('All fields are required');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    try {
      const response = await registerUser({
        username,
        email,
        password,
        security_question: securityQuestion,
        security_answer: securityAnswer,
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! You can now log in.');
        setIsRegistering(false); // Switch back to login view
        // Clear form
        setUsername('');
        setPassword('');
        setEmail('');
        setSecurityQuestion('');
        setSecurityAnswer('');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed.');
      console.error('Registration failed:', e);
    }
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgotpassword');
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h4" gutterBottom>Make Job Estimates on the Fly</Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>See About to Learn More</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      {isRegistering && (
        <>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Security Question"
            value={securityQuestion}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Security Answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </>
      )}

      <Box mt={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={isRegistering ? handleRegister : handleLogin} 
          sx={{ mr: 2 }}
        >
          {isRegistering ? 'Register' : 'Login'}
        </Button>
        <Button 
          color="secondary" 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(''); // Clear any errors when switching modes
            setSuccessMessage(''); // Clear success message when switching modes
          }}
        >
          {isRegistering ? 'Back to Login' : 'Create Account'}
        </Button>
        {!isRegistering && (
          <Button color="inherit" onClick={handleForgotPasswordClick} sx={{ ml: 2 }}>
            Forgot Password?
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Login;