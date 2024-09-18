import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress ,Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// NoProjectsAssigned Component
const NoProjectsAssigned = () => {
  return (
    <div className="no-projects-card">
      <div className="card-content">
        <div className="time-text">😔</div>
        <div className="day-text">No Projects Assigned</div>
      </div>
    </div>
  );
};

// ProjectCard Component
const ProjectCard = ({ project }) => {

        const navigate = useNavigate(); // Hook for navigation
      
        const handleViewTasks = () => {
            navigate(`/empviewtask/${project.projectId}`); // Navigate to the /empviewtask path
        };
  return (
    <Card style={{ margin: '15px', width: '350px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', overflow: 'visible' }}>
      <CardContent>
      
        <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
          {project.projectName}
        </Typography>
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
          color="primary" 
          style={{ marginTop: '15px' }}
          onClick={handleViewTasks}
        >
          View Tasks
        </Button>
      </CardContent>
    </Card>
  );
};

// UserProjects Component
const UserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:7777/project/getByUserId/${userId}`);
          if (response.status === 200) {
            setProjects(response.data);
            if (response.data.length === 0) {
              setError('No projects assigned');
            }
          } else {
            setError('No projects assigned');
          }
        } catch (err) {
          setError('No projects assigned');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No user ID found in session storage');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const styles = {
    content: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '20px'
    },
    loading: {
      textAlign: 'center',
      marginTop: '20px'
    },
    message: {
      width: '100%',
      textAlign: 'center'
    }
  };

  return (
    <div>
      {/* Navbar */}
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

      {/* Main Content */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}><CircularProgress /></div>
        ) : (
          <div style={styles.message}>
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project.projectId} project={project} />
              ))
            ) : (
              <NoProjectsAssigned />
            )}
          </div>
        )}
      </div>

      {/* Inline Styles for the Component */}
      <style jsx>{`
        .no-projects-card {
          width: 280px;
          height: 150px;
          background: linear-gradient(to right, rgb(20, 30, 48), rgb(36, 59, 85));
          border-radius: 15px;
          box-shadow: rgb(0,0,0,0.7) 5px 10px 50px, rgb(0,0,0,0.7) -5px 0px 250px;
          display: flex;
          color: white;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;
          cursor: default;
          transition: all 0.3s ease-in-out;
          overflow: hidden;
          margin: 0 auto;
        }

        .no-projects-card:hover {
          box-shadow: rgb(0,0,0) 5px 10px 50px, rgb(0,0,0) -5px 0px 250px;
        }

        .time-text {
          font-size: 50px;
          margin-top: 0px;
          font-weight: 600;
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }

        .day-text {
          font-size: 18px;
          margin-top: 0px;
          font-weight: 500;
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default UserProjects;
