import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Typography, 
  Box, 
  IconButton, 
  InputAdornment 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SplitLoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ NEW STATES
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!res.ok) {
        alert("Invalid credentials");
        setLoading(false);
        return;
      }

      const token = await res.text();

      // ✅ Save token
      localStorage.setItem("token", token);

      // optional: remember me
      if (rememberMe) {
        localStorage.setItem("rememberUser", username);
      }

      // ✅ Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        overflow: 'hidden',
      }}
    >

      {/* LEFT SIDE (UNCHANGED UI) */}
      <Box
        component={motion.div}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        sx={{
          width: { xs: '0%', md: '50%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 8,
          position: 'relative',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
          Welcome Back Admin
        </Typography>

        <Typography sx={{ maxWidth: 420, textAlign: 'center', opacity: 0.9 }}>
          We're excited to see you again! Log in to access your dashboard,
          manage your profile, and continue your journey with us.
        </Typography>
      </Box>


      {/* RIGHT SIDE FORM */}
      <Box
        component={motion.div}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{
          width: { xs: '100%', md: '50%' },
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 4, sm: 8 },
          borderTopLeftRadius: { md: 60 },
          borderBottomLeftRadius: { md: 60 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>

          <Typography variant="h4" fontWeight="bold" align="center">
            Admin Login
          </Typography>

          <Typography variant="body2" align="center" sx={{ mb: 5 }}>
            Enter your credentials to continue
          </Typography>

          {/* ✅ USERNAME */}
          <TextField
            fullWidth
            label="Email / Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* ✅ PASSWORD */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label={<Typography variant="body2">Remember me</Typography>}
            />

            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </Typography>
          </Box>

          {/* ✅ LOGIN BUTTON */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.6,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </Box>
      </Box>
    </Box>
  );
}
