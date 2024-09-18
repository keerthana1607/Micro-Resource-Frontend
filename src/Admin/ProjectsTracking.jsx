


import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, Chip } from '@mui/material';
import Swal from 'sweetalert2';
import AdminLayout from './Ad';

const statusColors = {
    'Not Started': '#f8d7da', // Light red
    'In progress': '#fff3cd', // Light yellow
    'Completed': '#d4edda' // Light green
};

const ProjectsTracking = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskDetails, setTaskDetails] = useState({});
    const [projectRemoved, setProjectRemoved] = useState(false);
    const [canRemoveProject, setCanRemoveProject] = useState(true); // New state to track if project can be removed

    // Fetch all projects
    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const response = await fetch('http://localhost:7777/project/getAll');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    console.error('Failed to fetch projects');
                    Swal.fire({
                        icon: 'error',
                        title: 'Fetch Error',
                        text: 'Failed to fetch projects.',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch Error',
                    text: 'Error occurred while fetching projects.',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllProjects();
    }, [projectRemoved]);

    // Fetch project details when a project is selected
    useEffect(() => {
        if (selectedProject) {
            const fetchProjectDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:7777/project/getbyId/${selectedProject.projectId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setTaskDetails({});

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

                        // Check if all tasks are completed
                        const allTasksCompleted = Object.values(tasksByEmployee).flat().every(task => task.taskStatus === 'Completed');
                        setCanRemoveProject(allTasksCompleted);
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
                }
            };

            fetchProjectDetails();
        }
    }, [selectedProject]);

    // Handle project removal
    const handleRemoveProject = async () => {
        if (selectedProject) {
            try {
                await fetch(`http://localhost:7777/project/${selectedProject.projectId}`, {
                    method: 'DELETE'
                });

                const statusIds = Object.values(taskDetails).flat().map(task => task.statusId);
                for (const statusId of statusIds) {
                    await fetch(`http://localhost:7777/status/delete/${statusId}`, {
                        method: 'DELETE'
                    });
                }

                setProjectRemoved(true);
                setSelectedProject(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Removed',
                    text: 'Project and associated tasks have been removed.',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                console.error('Error removing project:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Removal Error',
                    text: 'Error occurred while removing the project.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    // Handle project click
    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!projects.length) {
        return <div>No projects available.</div>;
    }

    if (projectRemoved && !selectedProject) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Typography variant="h4" component="h2">
                        Project Completed
                    </Typography>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ padding: '20px' }}>
                {!selectedProject ? (
                    <>
                        <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
                            Projects List
                        </Typography>
                        <Box display="flex" flexDirection="row" flexWrap="wrap" gap="20px">
                            {projects.map(project => (
                                <Card
                                    key={project.projectId}
                                    variant="outlined"
                                    style={{ minWidth: '300px', flex: '1 0 21%', marginBottom: '20px' }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            <strong>Project Name:</strong> {project.projectName}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            <strong>Description:</strong> {project.description}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            <strong>Start Date:</strong> {project.startDate}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            <strong>End Date:</strong> {project.endDate}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            <strong>Requirements:</strong> {project.requirementSkills}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            <strong>Status:</strong> {project.projectStatus}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginTop: '20px' }}
                                            onClick={() => handleProjectClick(project)}
                                        >
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </>
                ) : (
                    <div>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setSelectedProject(null)}
                            style={{ marginBottom: '20px' }}
                        >
                            Back to Projects List
                        </Button>
                        <Typography variant="h5" component="h2" style={{ marginBottom: '20px' }}>
                            Project Details: {selectedProject.projectName}
                        </Typography>
                        {selectedProject.emp.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Typography variant="h4" component="h2">
                                    Project Completed
                                </Typography>
                            </div>
                        ) : (
                            <>
                                <Typography variant="h6" component="h3" style={{ marginBottom: '20px' }}>
                                    Team Members
                                </Typography>
                                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="20px">
                                    {selectedProject.emp.map(employee => (
                                        <Card
                                            variant="outlined"
                                            style={{ minWidth: '300px', flex: '1 0 21%', marginBottom: '20px' }}
                                            key={employee.userId}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    <strong>Name:</strong> {employee.userName}
                                                </Typography>
                                                {employee.role === 'employee' && (
                                                    <>
                                                        <Typography variant="body1" color="textSecondary">
                                                            <strong>Email:</strong> {employee.userEmail || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary">
                                                            <strong>Mobile:</strong> {employee.userMobile || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary">
                                                            <strong>Skills:</strong> {employee.skills || 'N/A'}
                                                        </Typography>
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
                                                                                <TableCell>
                                                                                    <Chip
                                                                                        label={task.taskStatus}
                                                                                        style={{
                                                                                            backgroundColor: statusColors[task.taskStatus] || '#e9ecef',
                                                                                            color: 'black',
                                                                                            borderRadius: '16px',
                                                                                            padding: '8px',
                                                                                            fontSize: '0.75rem'
                                                                                        }}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>{task.totalHours}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        ) : (
                                                            <Typography>No tasks found for this employee.</Typography>
                                                        )}
                                                    </>
                                                )}
                                                {employee.role === 'project manager' && (
                                                    <>
                                                        <Typography variant="body1" color="textSecondary">
                                                            <strong>Email:</strong> {employee.userEmail || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body1" color="textSecondary">
                                                            <strong>Mobile:</strong> {employee.userMobile || 'N/A'}
                                                        </Typography>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ marginTop: '20px' }}
                                    onClick={handleRemoveProject}
                                    disabled={!canRemoveProject} // Use the new state here
                                >
                                    Release Project
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProjectsTracking;
