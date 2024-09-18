import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, Avatar, CssBaseline } from '@mui/material';
import Person2Icon from '@mui/icons-material/Person2';
import ProjectManagerDashboard from './ProjectDashboard';

const EditProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        userId: '',
        userName: '',
        userPassword: '',
        userMobile: '',
        userEmail: '',
        userAddress: '',
        role: '',
        skills: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const sessionUserId = sessionStorage.getItem("userId");
                const response = await axios.get(`http://localhost:7777/user/GetByUserId/${sessionUserId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:7777/user/updateUser', user);
            navigate('/userprofile'); // Redirect after successful update
        } catch (error) {
            console.error("Error updating user data", error);
        }
    };

    return (
        <ProjectManagerDashboard>
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
                    <Person2Icon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="User Name"
                        name="userName"
                        value={user.userName}
                        onChange={handleChange}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userPassword"
                        label="Password"
                        name="userPassword"
                        type="password"
                        value={user.userPassword}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userMobile"
                        label="Mobile Number"
                        name="userMobile"
                        value={user.userMobile}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userEmail"
                        label="Email"
                        name="userEmail"
                        value={user.userEmail}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userAddress"
                        label="Address"
                        name="userAddress"
                        value={user.userAddress}
                        onChange={handleChange}
                    />
                   
                   
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: 'black' }}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </Container>
               </ProjectManagerDashboard>
    );
};

export default EditProfilePage;
