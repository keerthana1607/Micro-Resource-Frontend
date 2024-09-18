// src/pages/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import Swal from 'sweetalert2';
import ProjectManagerDashboard from './ProjectDashboard';

const ProjectDetailPage = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskDetails, setTaskDetails] = useState({}); // State to store task details for each employee

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const storedProjectId = sessionStorage.getItem('projectId');
                if (!storedProjectId) {
                    throw new Error('No project ID found in session');
                }

                const response = await fetch(`http://localhost:7777/project/getbyId/${storedProjectId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProject(data);

                    // Fetch task details for each employee
                    const employeePromises = data.emp
                        .filter(emp => emp.role === 'employee')
                        .map(emp => fetch(`http://localhost:7777/status/getByUserId/${emp.userId}`).then(res => res.json()));

                    const results = await Promise.all(employeePromises);
                    const tasksByEmployee = {};

                    results.forEach(taskArray => {
                        taskArray.forEach(task => {
                            if (!tasksByEmployee[task.emp.userId]) {
                                tasksByEmployee[task.emp.userId] = [];
                            }
                            tasksByEmployee[task.emp.userId].push({
                                statusId: task.statusId,
                                taskStatus: task.taskStatus,
                                taskName: task.task.taskName,
                                totalHours: task.totalHours,
                            });
                        });
                    });

                    setTaskDetails(tasksByEmployee);
                } else {
                    console.error('Failed to fetch project details');
                    Swal.fire({
                        icon: 'error',
                        title: 'Fetch Error',
                        text: 'Failed to fetch project details.',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error fetching project details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch Error',
                    text: 'Error occurred while fetching project details.',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!project) {
        return <div>No project details available.</div>;
    }

    const employeeMembers = project.emp.filter(emp => emp.role === 'employee');

    return (
        <ProjectManagerDashboard>
            <div style={{ padding: '20px' }}>
                <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
                    Team Members
                </Typography>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="20px">
                    {employeeMembers.length > 0 ? (
                        employeeMembers.map(employee => (
                            <Card variant="outlined" style={{ minWidth: '300px', flex: '1 0 21%', marginBottom: '20px' }} key={employee.userId}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        <strong>Name:</strong> {employee.userName}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <strong>Email:</strong> {employee.userEmail || 'N/A'}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <strong>Mobile:</strong> {employee.userMobile || 'N/A'}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <strong>Role:</strong> {employee.role}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <strong>Skills:</strong> {employee.skills || 'N/A'}
                                    </Typography>
                                    {/* Display task details */}
                                    {taskDetails[employee.userId] && taskDetails[employee.userId].length > 0 ? (
                                        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Task Name</strong></TableCell>
                                                        <TableCell><strong>Status</strong></TableCell>
                                                        <TableCell><strong>Total Hours</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {taskDetails[employee.userId].map(task => (
                                                        <TableRow key={task.statusId}>
                                                            <TableCell>{task.taskName}</TableCell>
                                                            <TableCell>{task.taskStatus}</TableCell>
                                                            <TableCell>{task.totalHours}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography>No tasks found for this employee.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No team members with the role 'employee'.</Typography>
                    )}
                </Box>
            </div>
        </ProjectManagerDashboard>
    );
};

export default ProjectDetailPage;
