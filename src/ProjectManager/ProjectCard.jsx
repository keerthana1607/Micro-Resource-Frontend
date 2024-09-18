


//---------------------------------------------------------------validation
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import ProjectDashboard from './ProjectDashboard'; // Import ProjectDashboard component

const ProjectCard = ({ project, onCreateTask, tasksConfirmed }) => {
    const buttonColor = project.projectStatus === 'Assigned' ? '#4caf50' : '#ffa31a'; // Green for "Assigned", orange otherwise
    const buttonText = project.projectStatus === 'Assigned' 
        ? 'Tasks Assigned' 
        : (tasksConfirmed ? 'Tasks Confirmed' : 'Create Task'); // Button text based on status and task confirmation

    return (
        <Card style={{ margin: '15px', width: '350px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', overflow: 'visible' }}>
            <CardContent>
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                    {project.projectName}
                </Typography>
                <Chip 
                    label={project.projectStatus || 'Pending'} 
                    style={{
                        marginTop: '10px',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        backgroundColor: project.projectStatus === 'Assigned' ? '#4caf50' : '#ffa31a', // Green for "Assigned"
                        color: '#fff',
                        fontWeight: 'bold'
                    }}
                />
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                    <strong>Description:</strong> {project.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>Start Date:</strong> {project.startDate}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>End Date:</strong> {project.endDate}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>Skills Required:</strong> {project.requirementSkills}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>Members:</strong> {project.members}
                </Typography>
                <Button 
                    variant="contained"
                    style={{ 
                        marginTop: '10px', 
                        backgroundColor: buttonColor, 
                        color: '#ffffff'
                    }} 
                    onClick={() => !tasksConfirmed && onCreateTask(project.projectId)} 
                    disabled={tasksConfirmed || project.projectStatus === 'Assigned'} // Disable if tasks confirmed or status is "Assigned"
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
};

const ProjectTable = () => {
    const [projects, setProjects] = useState([]);
    const [tasksByProject, setTasksByProject] = useState({});
    const [openProjectModal, setOpenProjectModal] = useState(false);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [newProject, setNewProject] = useState({
        projectName: '',
        description: '',
        startDate: '',
        endDate: '',
        requirementSkills: '',
        members: '', // Initial empty string, will convert to number
        projectStatus: 'Pending', // Default value
        userId: null // Initialize as null
    });
    const [tasks, setTasks] = useState([{ description: '' }]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserId = async () => {
            const sessionUserId = parseInt(window.sessionStorage.getItem('userId'), 10); // Ensure userId is a number
            if (!isNaN(sessionUserId)) {
                setNewProject(prev => ({ ...prev, userId: sessionUserId }));
                fetchProjects(sessionUserId); // Fetch projects based on the userId
            }
        };

        fetchUserId();
    }, []);

    const fetchProjects = async (userId) => {
        try {
            const response = await fetch(`http://localhost:7777/project/getByUserId/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
                fetchTasksForProjects(data.map(project => project.projectId));
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchTasksForProjects = async (projectIds) => {
        try {
            const tasksData = await Promise.all(
                projectIds.map(async (projectId) => {
                    const response = await fetch(`http://localhost:7777/task/getAll?projectId=${projectId}`);
                    if (response.ok) {
                        const data = await response.json();
                        return { projectId, tasks: data };
                    } else {
                        console.error(`Failed to fetch tasks for projectId ${projectId}`);
                        return { projectId, tasks: [] };
                    }
                })
            );

            const tasksMap = tasksData.reduce((acc, { projectId, tasks }) => {
                acc[projectId] = tasks.length > 0;
                return acc;
            }, {});

            setTasksByProject(tasksMap);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const validateProjectForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!newProject.projectName) {
            formErrors.projectName = 'Project Name is required';
            isValid = false;
        }

        if (!newProject.description) {
            formErrors.description = 'Description is required';
            isValid = false;
        }

        if (!newProject.startDate) {
            formErrors.startDate = 'Start Date is required';
            isValid = false;
        } else if (new Date(newProject.startDate) < new Date()) {
            formErrors.startDate = 'Start Date cannot be in the past';
            isValid = false;
        }

        if (!newProject.endDate) {
            formErrors.endDate = 'End Date is required';
            isValid = false;
        } else if (new Date(newProject.endDate) < new Date(newProject.startDate)) {
            formErrors.endDate = 'End Date cannot be before Start Date';
            isValid = false;
        }

        if (isNaN(newProject.members) || newProject.members <= 0) {
            formErrors.members = 'Number of members must be a positive number';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleOpenProjectModal = () => {
        if (projects.length > 0) {
            Swal.fire({
                icon: 'info',
                title: 'Project Exists',
                text: 'You have an existing project. Complete it before adding a new one.',
                confirmButtonText: 'OK'
            });
            return;
        }
        setOpenProjectModal(true);
    };

    const handleCloseProjectModal = () => {
        setOpenProjectModal(false);
        setNewProject({
            projectName: '',
            description: '',
            startDate: '',
            endDate: '',
            requirementSkills: '',
            members: '',
            projectStatus: 'Pending',
            userId: newProject.userId
        });
        setErrors({});
    };

    const handleOpenTaskModal = (projectId) => {
        setSelectedProjectId(projectId);
        setOpenTaskModal(true);
    };

    const handleCloseTaskModal = () => {
        setOpenTaskModal(false);
        setTasks([{ description: '' }]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = name === 'members' ? Number(value) : value;
        setNewProject(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleAddProject = async () => {
        if (!validateProjectForm()) {
            return;
        }

        if (projects.length > 0) {
            Swal.fire({
                icon: 'info',
                title: 'Project Exists',
                text: 'You have an existing project. Complete it before adding a new one.',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:7777/project/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            if (response.ok) {
                const projectData = await response.json();
                const newProjectId = projectData.projectId;

                // Store the projectId in session storage
                sessionStorage.setItem('projectId', newProjectId);

                setProjects([...projects, { ...newProject, projectId: newProjectId }]); // Add the new project to the list
                handleCloseProjectModal();
                handleOpenTaskModal(newProjectId); // Open task modal for the new project
            } else {
                console.error('Failed to add project');
                Swal.fire({
                    icon: 'error',
                    title: 'Project Creation Failed',
                    text: 'Failed to create project.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error adding project:', error);
            Swal.fire({
                icon: 'error',
                title: 'Project Creation Failed',
                text: 'Failed to create project.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleAddTask = () => {
        setTasks([...tasks, { description: '' }]);
    };

    const handleTaskChange = (index, value) => {
        const newTasks = [...tasks];
        newTasks[index].description = value;
        setTasks(newTasks);
    };

    const handleCreateTasks = async () => {
        try {
            const taskCreationPromises = tasks.map(task =>
                fetch('http://localhost:7777/task/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        taskName: task.description, // Matches `taskName` in Task POJO
                        project: { projectId: selectedProjectId }, // Ensure this matches the `Project` object expected
                        taskStatus: [] // Sending an empty list for `taskStatus`
                    }),
                })
            );

            const responses = await Promise.all(taskCreationPromises);

            if (responses.every(response => response.ok)) {
                Swal.fire({
                    icon: 'success',
                    title: 'Tasks Created',
                    text: 'Tasks have been successfully created.',
                    confirmButtonText: 'OK'
                });
                setTasksByProject(prev => ({ ...prev, [selectedProjectId]: true })); // Update tasks confirmed status
                fetchProjects(newProject.userId);
                handleCloseTaskModal();
            } else {
                responses.forEach((response, index) => {
                    if (!response.ok) {
                        console.error(`Task creation failed for task ${index + 1}:`, response.statusText);
                    }
                });
                Swal.fire({
                    icon: 'error',
                    title: 'Task Creation Failed',
                    text: 'Failed to create some tasks.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error creating tasks:', error);
            Swal.fire({
                icon: 'error',
                title: 'Task Creation Failed',
                text: 'Failed to create tasks.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <ProjectDashboard>
            <div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    style={{ margin: '20px' }} 
                    onClick={handleOpenProjectModal}
                >
                    Add New Project
                </Button>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {projects.map(project => (
                        <ProjectCard 
                            key={project.projectId}
                            project={project}
                            onCreateTask={handleOpenTaskModal}
                            tasksConfirmed={tasksByProject[project.projectId] || false}
                        />
                    ))}
                </div>

                {/* Project Modal */}
                <Dialog open={openProjectModal} onClose={handleCloseProjectModal}>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="projectName"
                            label="Project Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newProject.projectName}
                            onChange={handleInputChange}
                            error={!!errors.projectName}
                            helperText={errors.projectName}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newProject.description}
                            onChange={handleInputChange}
                            error={!!errors.description}
                            helperText={errors.description}
                        />
                        <TextField
                            margin="dense"
                            name="startDate"
                            label="Start Date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            value={newProject.startDate}
                            onChange={handleInputChange}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            inputProps={{ min: new Date().toISOString().split('T')[0] }} // Prevent past dates
                        />
                        <TextField
                            margin="dense"
                            name="endDate"
                            label="End Date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            value={newProject.endDate}
                            onChange={handleInputChange}
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                            inputProps={{ min: newProject.startDate ? newProject.startDate : new Date().toISOString().split('T')[0] }} // Prevent past dates and ensure end date is after start date
                        />
                        <TextField
                            margin="dense"
                            name="requirementSkills"
                            label="Skills Required"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newProject.requirementSkills}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="members"
                            label="Resource"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={newProject.members}
                            onChange={handleInputChange}
                            error={!!errors.members}
                            helperText={errors.members}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseProjectModal}>Cancel</Button>
                        <Button onClick={handleAddProject}>Add Project</Button>
                    </DialogActions>
                </Dialog>

                {/* Task Modal */}
                <Dialog open={openTaskModal} onClose={handleCloseTaskModal}>
                    <DialogTitle>Create Tasks for Project</DialogTitle>
                    <DialogContent>
                        {tasks.map((task, index) => (
                            <TextField
                                key={index}
                                margin="dense"
                                label={`Task ${index + 1}`}
                                type="text"
                                fullWidth
                                variant="standard"
                                value={task.description}
                                onChange={(e) => handleTaskChange(index, e.target.value)}
                            />
                        ))}
                        <Button onClick={handleAddTask} style={{ marginTop: '10px' }}>
                            Add Another Task
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseTaskModal}>Cancel</Button>
                        <Button onClick={handleCreateTasks}>Create Tasks</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ProjectDashboard>
    );
};

export default ProjectTable;
