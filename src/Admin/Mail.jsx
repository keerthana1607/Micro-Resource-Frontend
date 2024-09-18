import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import AdminLayout from './Ad'; // Make sure this import is correct
import Swal from 'sweetalert2';

const Mail = () => {
    const [emailDetails, setEmailDetails] = useState({
        to: '',
        subject: '',
        body: ''
    });
    const [loading, setLoading] = useState(false);

    const emailOptions = [
        'kiruthikkamuthuraman@gmail.com',
        'keerthanaprabu0@gmail.com',
        'girivasan103@gmail.com'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailDetails({ ...emailDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:7777/hr/send', emailDetails);
            
            // Show success alert after a delay
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent',
                    text: 'The email has been sent successfully to HR.',
                });
                setLoading(false);
            }, 3000); // Show loader for 3 seconds

        } catch (error) {
            console.error('Error sending email:', error);
            
            // Show error alert after a delay
            setTimeout(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Send Email',
                    text: 'There was an issue sending the email.',
                });
                setLoading(false);
            }, 3000); // Show loader for 3 seconds
        }
    };

    return (
        <AdminLayout>
            <Container component="main" maxWidth="md"> {/* Changed to 'md' */}
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Card sx={{ maxWidth: 600, mx: 'auto' }}> {/* Set maxWidth and center card */}
                            <CardContent>
                                <Typography component="h1" variant="h5" align="center">
                                    Notify HR 
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel id="recipient-email-label">Recipient Email</InputLabel>
                                        <Select
                                            labelId="recipient-email-label"
                                            name="to"
                                            value={emailDetails.to}
                                            onChange={handleChange}
                                            autoFocus
                                        >
                                            {emailOptions.map((email, index) => (
                                                <MenuItem key={index} value={email}>
                                                    {email}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="subject"
                                        label="Subject"
                                        value={emailDetails.subject}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="body"
                                        label="Body"
                                        multiline
                                        rows={4}
                                        value={emailDetails.body}
                                        onChange={handleChange}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2, bgcolor: 'black' }}
                                    >
                                        Send Email
                                    </Button>
                                    {loading && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                mt: 2
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    );
};

export default Mail;
