

//------------------------------------------------------------------------------------------okie final

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import Swal from 'sweetalert2';
import AdminLayout from './Ad'; // Ensure this is the correct import path

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  useEffect(() => {
    const fetchProjectsAndRoles = async () => {
      try {
        const projectsResponse = await fetch('http://localhost:7777/project/getAll');
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        const rolesResponse = await fetch('http://localhost:7777/project/roles');
        const rolesData = await rolesResponse.json();
        // Optionally use rolesData here if needed
      } catch (error) {
        console.error('Error fetching projects or roles:', error);
      }
    };

    fetchProjectsAndRoles();
  }, []);

  const getProjectStatus = (project) => {
    if (!project.emp || project.emp.length === 0) {
        return 'Completed';
    }

    const hasEmployee = project.emp.some(employee => employee.role === 'employee');
    if (hasEmployee) return 'Project Allocated';

    const hasRole = project.emp.some(employee => employee.role === 'project manager');
    return hasRole ? 'Pending' : 'Unknown';
};
  const handleAssign = async (project) => {
    setSelectedProject(project);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:7777/user/getAllUnmappedUser');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const employeesList = data.filter(user => user.role === 'employee');
      const requiredSkills = project.requirementSkills ? project.requirementSkills.toLowerCase().split(',').map(skill => skill.trim()) : [];

      const filteredList = employeesList.filter(employee => {
        const employeeSkills = employee.skills ? employee.skills.toLowerCase().split(',').map(skill => skill.trim()) : [];
        return requiredSkills.some(requiredSkill => employeeSkills.includes(requiredSkill));
      });

      setEmployees(employeesList);
      setFilteredEmployees(filteredList);
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employee.userId)
        ? prevSelected.filter(id => id !== employee.userId)
        : [...prevSelected, employee.userId]
    );
  };

  const handleCreateAssignments = async () => {
    if (!selectedProject || selectedEmployees.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:7777/project/update/${selectedProject.projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedEmployees),
      });

      if (response.ok) {
        const responseProjects = await fetch('http://localhost:7777/project/getAll');
        const dataProjects = await responseProjects.json();
        setProjects(dataProjects);

        handleCloseDialog();

        Swal.fire({
          icon: 'success',
          title: 'Employees Allocated',
          text: 'Employees have been successfully allocated to the project.',
          confirmButtonText: 'OK'
        });
      } else {
        const responseText = await response.text();
        Swal.fire({
          icon: 'error',
          title: 'Allocation Failed',
          text: `Failed to allocate employees: ${responseText}`,
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error allocating employees:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while allocating employees.',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        {projects.map((project) => {
          const projectStatus = getProjectStatus(project);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.projectId}>
              <Card 
                style={{ 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
                  position: 'relative'
                }}
              >
                <CardContent style={{ paddingBottom: '80px' }}>
                  <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                    {project.projectName || 'No Project Name'}
                  </Typography>
                  <Chip 
    label={projectStatus}
    style={{
        marginTop: '10px',
        borderRadius: '20px',
        padding: '5px 10px',
        backgroundColor: projectStatus === 'Project Allocated' 
            ? '#4caf50' 
            : projectStatus === 'Completed' 
            ? '#6600cc' 
            : '#ffa31a',
        color: '#fff',
        fontWeight: 'bold'
    }}
/>

                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                    <strong>Description:</strong> {project.description || 'No Description'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>Start Date:</strong> {project.startDate || 'No Start Date'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>End Date:</strong> {project.endDate || 'No End Date'}
                  </Typography>
                 
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>Members:</strong> {project.members || 'No Members'}
                    
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
                    <strong>Requirements:</strong> {project.requirementSkills || 'No requirements'}
                    
                  </Typography>
                </CardContent>
                {projectStatus === 'Pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      position: 'absolute',
                      bottom: '15px',
                      right: '15px',
                      borderRadius: '20px',
                    }}
                    onClick={() => handleAssign(project)}
                  >
                    Assign
                  </Button>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Employee Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Select Employees</DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="spinner">
              <div className="loader l1"></div>
              <div className="loader l2"></div>
            </div>
          ) : (
            <List>
              {filteredEmployees.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No employees found with required skills" />
                </ListItem>
              ) : (
                filteredEmployees.map((employee) => (
                  <ListItem key={employee.userId}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedEmployees.includes(employee.userId)}
                          onChange={() => handleEmployeeSelect(employee)}
                        />
                      }
                      label={
                        <ListItemText
                          primary={employee.userName}
                          secondary={
                            <>
                              <div>{employee.userEmail}</div>
                              <div>{employee.skills}</div>
                              
                            </>
                          }
                        />
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          <Button 
            onClick={handleCreateAssignments} 
            color="primary" 
            disabled={selectedEmployees.length === 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loader Styling */}
      <style jsx>{`
        .spinner {
          border: 0 solid transparent;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .loader {
          width: inherit;
          height: inherit;
          position: absolute;
        }

        .loader::before,
        .loader::after {
          content: '';
          border: 3px solid #505065;
          border-radius: 50%;
          width: inherit;
          height: inherit;
          position: absolute;
          opacity: 1;
        }

        .l1::before,
        .l1::after {
          animation: clockwiseZ 2.5s infinite;
        }

        .l2::after,
        .l2::before {
          animation: anticlockwiseZ 2.5s infinite;
        }

        @keyframes clockwiseZ {
          0%, 100% {
            transform: rotateY(0);
          }
          50% {
            transform: rotateY(180deg) skew(-10deg, -5deg);
          }
        }

        @keyframes anticlockwiseZ {
          0%, 100% {
            transform: rotateX(0);
          }
          50% {
            transform: rotateX(-180deg) skew(10deg, 5deg);
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default ViewProjects;


//----------------------------------------------------------------------------randamization

