
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { NavLink, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();

  const [userName, setUserName] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [userNameError, setUserNameError] = React.useState("");
  const [userPasswordError, setUserPasswordError] = React.useState("");

  React.useEffect(() => {
    const storedUserName = sessionStorage.getItem("userName");
    const storedRole = sessionStorage.getItem("role");

    if (storedUserName && storedRole) {
      switch (storedRole) {
        case 'admin':
          navigate("/adminhome");
          break;
        case 'project manager':
          navigate("/managerhome");
          break;
        case 'employee':
          navigate("/employeehome");
          break;
        default:
          sessionStorage.clear();
          navigate("/login");
      }
    }
  }, [navigate]);

  const handleUserNameBlur = () => {
    if (userName.trim().length === 0) {
      setUserNameError("Username is required");
    } else {
      setUserNameError("");
    }
  };

  const handleUserPasswordBlur = () => {
    if (userPassword.trim().length === 0) {
      setUserPasswordError("Password is required");
    } else if (userPassword.length < 3) {
      setUserPasswordError("Password must be at least 8 characters");
    } else {
      setUserPasswordError("");
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform final validation checks before making the API call
    if (userNameError || userPasswordError) {
        console.log('Validation failed');
        return;
    }

    const url = `http://localhost:7777/user/loginUser/${userName}/${userPassword}`;
    try {
        const response = await axios.get(url);
        console.log('API response:', response.data);

        // Check if the response data contains role and userId
        const { role, userId } = response.data;

        if (role && userId) {
            // Store user information in session storage
            sessionStorage.setItem("userName", userName);
            sessionStorage.setItem("role", role);
            sessionStorage.setItem("userId", userId); // Store userId

            navigateBasedOnRole(role);
        } else {
            console.error('Unexpected response format:', response.data);
            alert("Login failed. Please check your credentials.");
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert("An error occurred. Please try again.");
    }
};

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate("/adminhome");
        break;
      case 'project manager':
        navigate("/managerhome");
        break;
      case 'employee':
        navigate("/employeehome");
        break;
      default:
        console.error('Invalid role');
        sessionStorage.clear();
        navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark login-navbar">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">Corporate Resource Management System</a>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/"><ArrowBackIcon /> Back to Home</a>
            </li>
          </ul>
        </div>
      </nav>

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'black' }}>
              <PersonIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              User - Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Enter Username"
                  name="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={handleUserNameBlur}
                  error={!!userNameError}
                  helperText={userNameError}
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="password"
                  label="Enter Password"
                  name="userPassword"
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  onBlur={handleUserPasswordBlur}
                  error={!!userPasswordError}
                  helperText={userPasswordError}
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: 'black' }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <NavLink to={'/register'} variant="body2">
                      {"Don't have an account? Sign Up"}
                    </NavLink>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
