

//--------------------------------------modal
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Modal,
  Box,
  TextField,
  MenuItem,
  Button,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useParams } from 'react-router-dom';
import TaskComparisonChart from './EmpWorkload'; // Import the chart component
import MuiAlert from '@mui/material/Alert';

// Helper functions
const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const calculateEstimatedHours = (totalDays) => {
  return totalDays * 8; // Assuming 8 working hours per day
};

const EmpViewTask = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  const[workedHours,setWorkedHours]=useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    taskName: '',
    taskStatus: '',
    estimatedHours: '',
    projectId: ''
  });
  const [statusToEdit, setStatusToEdit] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAddDisabled, setIsAddDisabled] = useState(false);

  
 
  
  
  useEffect(() => {
    const fetchTasksAndProjectDetails = async () => {
      if (projectDetails) {
        const totalDays = calculateTotalDays(projectDetails.startDate, projectDetails.endDate);
        const calculatedestimatedHours = calculateEstimatedHours(totalDays);
        setWorkedHours(calculatedestimatedHours);
      }
      try {
        // Fetch tasks
        const tasksResponse = await axios.get(`http://localhost:7777/task/taskproject/${projectId}`);
        if (tasksResponse.status === 200) {
          const fetchedTasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : [];
          
          // Load statuses from sessionStorage and merge with tasks
          const storedStatuses = JSON.parse(sessionStorage.getItem('task_statuses')) || [];
          
          const tasksWithStatus = fetchedTasks.map(task => {
            const status = storedStatuses.find(s => s.task.taskId === task.taskId);
            return {
              ...task,
              taskStatus: status ? status.taskStatus : task.taskStatus,
              estimatedHours: status ? status.totalHours : task.estimatedHours,
              statusId: status ? status.statusId : task.statusId
            };
          });
  
          // Calculate total hours
          const totalHoursCalculated = tasksWithStatus.reduce((acc, task) => acc + (task.estimatedHours || 0), 0);
  
          setTasks(tasksWithStatus);
          setTotalHours(totalHoursCalculated); // Set totalHours state
        } else {
          setError('No tasks found');
        }
  
        // Fetch project details
        const projectResponse = await axios.get(`http://localhost:7777/project/getbyId/${projectId}`);
        if (projectResponse.status === 200) {
          setProjectDetails(prevDetails => ({
            ...projectResponse.data,
            totalHours: prevDetails ? prevDetails.totalHours : 0
          }));
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasksAndProjectDetails();


    
  }, [projectId]);
  


  const handleOpen = (task) => {
    if (task) {
      setSelectedTask(task);
      setTaskForm({
        taskName: task.taskName || '',
        taskStatus: task.taskStatus || 'Not started',
        estimatedHours: (task.estimatedHours || '0').toString(),
        projectId: projectId || ''
      });
      setStatusToEdit(null);
      setOpen(true);
    } else {
      console.error('Task is undefined or null');
      setError('No task selected');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
    setIsAddDisabled(false); // Enable the Add button again
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskForm({
      ...taskForm,
      [name]: value
    });
  };
console.log('Estimated Hours:', calculateEstimatedHours);
console.log('Total Hours:', totalHours);

  
  const updateSessionStorageWithStatuses = (statuses) => {
    sessionStorage.setItem('task_statuses', JSON.stringify(statuses));
  };
  
  const handleStatusAdd = async () => {
    if (!selectedTask) {
      console.error('Selected task is not available');
      setError('No task selected');
      return;
    }
  
    try {
      const empId = sessionStorage.getItem('userId');
      if (!empId) {
        throw new Error('Employee ID not found in session');
      }
  
      const statusData = {
        taskStatus: taskForm.taskStatus,
        totalHours: parseInt(taskForm.estimatedHours, 10),
        emp: {
          userId: Number(empId)
        },
        task: {
          taskId: selectedTask.taskId
        }
      };
  
      const response = await axios.post('http://localhost:7777/status/create', statusData, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 200) {
        const { statusId, message } = response.data;
        if (typeof statusId === 'number') {
          // Retrieve existing statuses from sessionStorage
          const existingStatuses = JSON.parse(sessionStorage.getItem('task_statuses')) || [];
          // Add the new status to the array
          existingStatuses.push({ ...statusData, statusId });
          // Update sessionStorage
          updateSessionStorageWithStatuses(existingStatuses);
          // Update task list and state
          setTasks(tasks.map(task =>
            task.taskId === selectedTask.taskId ? { ...task, statusId, taskStatus: taskForm.taskStatus, estimatedHours: taskForm.estimatedHours } : task
          ));
          setAlertMessage(message || 'Status successfully added!');
          setShowAlert(true);
          setIsAddDisabled(true); // Disable the Add button after adding
          handleClose();
        } else {
          throw new Error('Unexpected response format');
        }
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error adding status:', err.response?.data || err.message || err);
      setError(`Error adding status: ${err.response?.data || err.message || 'Unknown error'}`);
    }
  };
  
  const handleUpdate = async () => {
    if (!selectedTask || !statusToEdit || !taskForm.taskStatus || !taskForm.estimatedHours) {
      console.error('Required information is missing', { selectedTask, statusToEdit, taskForm });
      setError('Required information is missing');
      return;
    }
  
    try {
      const empId = sessionStorage.getItem('userId');
      if (!empId) {
        throw new Error('Employee ID not found in session');
      }
  
      const updatedTaskData = {
        taskStatus: taskForm.taskStatus,
        totalHours: parseInt(taskForm.estimatedHours, 10),
        emp: {
          userId: Number(empId)
        },
        task: {
          taskId: selectedTask.taskId
        }
      };
  
      const response = await axios.put(`http://localhost:7777/status/update/${statusToEdit.statusId}`, updatedTaskData, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 200) {
        // Retrieve existing statuses from sessionStorage
        const existingStatuses = JSON.parse(sessionStorage.getItem('task_statuses')) || [];
        // Update the status in the array
        const updatedStatuses = existingStatuses.map(status =>
          status.statusId === statusToEdit.statusId ? { ...updatedTaskData, statusId: statusToEdit.statusId } : status
        );
        // Update sessionStorage
        updateSessionStorageWithStatuses(updatedStatuses);
        // Update task list and state
        setTasks(tasks.map(task =>
          task.taskId === selectedTask.taskId ? { ...task, taskStatus: taskForm.taskStatus, estimatedHours: taskForm.estimatedHours } : task
        ));
        setAlertMessage('Status successfully updated!');
        setShowAlert(true);
        handleClose();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error updating task:', err.response?.data || err.message || err);
      setError(`Error updating task: ${err.response?.data || err.message || 'Unknown error'}`);
    }
  };
  

  const handleEdit = async (statusId) => {
    if (!statusId) {
      console.error('Invalid status ID');
      setError('Invalid status ID');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:7777/status/getbyId/${statusId}`);
      if (response.status === 200) {
        const status = response.data;
        setSelectedTask(status.task);
        setTaskForm({
          taskName: status.task.taskName || '',
          taskStatus: status.taskStatus || 'Not started',
          estimatedHours: (status.totalHours || '0').toString(),
          projectId: projectId || ''
        });
        setStatusToEdit(status);
        setOpen(true);
      } else {
        throw new Error(`Failed to fetch status details: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching status details:', err);
      setError(`Error fetching status details: ${err.response?.data || err.message || 'Unknown error'}`);
    }
  };

  const handleChartOpen = () => {
    setChartOpen(true);
  };

  const handleChartClose = () => {
    setChartOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">Corporate Resource Pool Management System</a>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/employeehome">BACK</a>
            </li>
          </ul>
        </div>
      </nav>

      {error && <Typography color="error">{error}</Typography>}

      {projectDetails && (
      
      <Card style={{ margin: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
      <CardContent style={{ padding: '20px' }}>
        {/* Project Heading */}
        <Typography
          variant="h5"
          style={{
            marginBottom: '20px',
            textAlign: 'center',
            color: '#3f51b5',
            fontWeight: 'bold'
          }}
        >
          {projectDetails.projectName}
        </Typography>
    
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '10px' }}>
              <Typography
                variant="h6"
                style={{ fontWeight: 'bold', color: '#555' }}
              >
                Description:
              </Typography>
              <Typography
                variant="body1"
                style={{ color: '#333' }}
              >
                {projectDetails.description}
              </Typography>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Typography
                variant="h6"
                style={{ fontWeight: 'bold', color: '#555' }}
              >
                Duration:
              </Typography>
              <Typography
                variant="body1"
                style={{ color: '#333' }}
              >
                {projectDetails.startDate} to {projectDetails.endDate}
              </Typography>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Typography
                variant="h6"
                style={{ fontWeight: 'bold', color: '#555' }}
              >
                Total Days:
              </Typography>
              <Typography
                variant="body1"
                style={{ color: '#333' }}
              >
                {calculateTotalDays(projectDetails.startDate, projectDetails.endDate)}
              </Typography>
            </div>
          </div>
    
          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '10px' }}>
              <Typography
                variant="h6"
                style={{ fontWeight: 'bold', color: '#555' }}
              >
                Estimated Hours:
              </Typography>
              <Typography
                variant="body1"
                style={{ color: '#333' }}
              >
                {calculateEstimatedHours(calculateTotalDays(projectDetails.startDate, projectDetails.endDate))}
              </Typography>
            </div>
            <div>
              <Typography
                variant="h6"
                style={{ fontWeight: 'bold', color: '#555' }}
              >
                Total Task Hours:
              </Typography>
              <Typography
                variant="body1"
                style={{ color: '#333' }}
              >
                {totalHours || 0}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChartOpen}
                style={{ marginTop: '20px' }}
              >
                Analyze Workload
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    


      )}

     
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
  {tasks.map((task) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={task.taskId}>
      <Card style={{ maxWidth: '280px', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <CardContent style={{ flex: 1, padding: '16px' }}>
          <Typography variant="h6" style={{ fontSize: '1rem', marginBottom: '8px', textAlign: 'center' }}>
            {task.taskName}
          </Typography>
          <Typography color="textSecondary" style={{ fontSize: '0.875rem', marginBottom: '4px', textAlign: 'center' }}>
            {task.taskStatus || 'Not started'}
          </Typography>
          <Typography color="textSecondary" style={{ fontSize: '0.875rem', textAlign: 'center' }}>
            Hours For a Task: {task.estimatedHours || '0'}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'center', padding: '8px' }}>
          <IconButton
            color="primary"
            onClick={() => handleEdit(task.statusId)}
            style={{ padding: '8px' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          {!task.statusId && (
            <IconButton
              color="secondary"
              onClick={() => handleOpen(task)}
              disabled={isAddDisabled}
              style={{ padding: '8px' }}
            >
              <AddCircleIcon fontSize="small" />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>




<Modal open={chartOpen} onClose={handleChartClose}>
  <Box style={{ 
    padding: '20px', 
    margin: 'auto', 
    marginTop: '5%', 
    maxWidth: '80%', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
    overflow: 'auto' 
  }}>
   <TaskComparisonChart
  calculateEstimatedHours={calculateEstimatedHours(calculateTotalDays(projectDetails.startDate, projectDetails.endDate))}
  totalHours={totalHours}
/>
  </Box>
</Modal>


      {/* Status Form Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box style={{ padding: '20px', margin: 'auto', marginTop: '10%', maxWidth: '500px', backgroundColor: '#fff' }}>
          <Typography variant="h6">{statusToEdit ? 'Edit Status' : 'Add Status'}</Typography>
          <TextField
            label="Task Name"
            name="taskName"
            value={taskForm.taskName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Status"
            name="taskStatus"
            value={taskForm.taskStatus}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="Not started">Not started</MenuItem>
            <MenuItem value="In progress">In progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <TextField
            label="Estimated Hours"
            name="estimatedHours"
            value={taskForm.estimatedHours}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <Box style={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={statusToEdit ? handleUpdate : handleStatusAdd}
              disabled={isAddDisabled}
            >
              {statusToEdit ? 'Update' : 'Add'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for alerts */}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <MuiAlert onClose={() => setShowAlert(false)} severity="success">
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default EmpViewTask;
