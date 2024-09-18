

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from '@mui/material';
import AdminLayout from './Ad'; // Ensure this is the correct import path

const ProjectManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [unmappedManagers, setUnmappedManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newManager, setNewManager] = useState({
    userName: '',
    userPassword: '',
    userMobile: '',
    userEmail: '',
    userAddress: '',
    role: 'project manager', // Set default role to 'project manager'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchManagers();
    fetchUnmappedManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:7777/user/getAllUserList');
      if (response.ok) {
        const data = await response.json();
        // Filter managers to include only those with the role 'project manager'
        const filteredManagers = data.filter(manager => manager.role === 'project manager');
        setManagers(filteredManagers);
      } else {
        console.error('Failed to fetch managers');
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchUnmappedManagers = async () => {
    try {
      const response = await fetch('http://localhost:7777/user/getAllUnmappedUserManager');
      if (response.ok) {
        const data = await response.json();
        setUnmappedManagers(data);
        console.log('Unmapped Managers:', data); // Debugging line
      } else {
        console.error('Failed to fetch unmapped managers');
      }
    } catch (error) {
      console.error('Error fetching unmapped managers:', error);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!newManager.userName) {
      formErrors.userName = 'User Name is required';
      isValid = false;
    }

    if (!newManager.userMobile || !/^\d{10}$/.test(newManager.userMobile)) {
      formErrors.userMobile = 'Mobile number must be 10 digits';
      isValid = false;
    }

    if (!newManager.userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newManager.userEmail)) {
      formErrors.userEmail = 'Valid email is required (e.g., example@gmail.com)';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewManager({
      userName: '',
      userPassword: '',
      userMobile: '',
      userEmail: '',
      userAddress: '',
      role: 'project manager', // Keep default role
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewManager((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddManager = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:7777/user/doUserInsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newManager),
      });

      if (response.ok) {
        await response.json();
        fetchManagers();
        fetchUnmappedManagers();
        handleClose();
      } else {
        console.error('Failed to add manager');
      }
    } catch (error) {
      console.error('Error adding manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const getManagerStatus = (managerId) => {
    console.log(`Checking status for Manager ID: ${managerId}`); // Debugging line
    const isMapped = unmappedManagers.some(manager => manager.userId === managerId);
    console.log(`Manager ID: ${managerId}, Is Mapped: ${!isMapped}`); // Debugging line
    return isMapped ? 'Not In Project' : 'Assigned In Project';
  };

  return (
    <AdminLayout>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Project Manager
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
                <Typography variant="h6">ID</Typography>
              </TableCell>
              <TableCell style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
                <Typography variant="h6">Name</Typography>
              </TableCell>
              <TableCell style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
                <Typography variant="h6">Mobile</Typography>
              </TableCell>
              <TableCell style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
                <Typography variant="h6">Email</Typography>
              </TableCell>
              <TableCell style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
                <Typography variant="h6">Address</Typography>
              </TableCell>
              {/* Removed Skills Column */}
              <TableCell style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd' }}>
                <Typography variant="h6">Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.userId}>
                <TableCell style={{ border: '1px solid #ddd' }}>{manager.userId}</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>{manager.userName}</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>{manager.userMobile}</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>{manager.userEmail}</TableCell>
                <TableCell style={{ border: '1px solid #ddd' }}>{manager.userAddress}</TableCell>
                {/* Removed Skills Column */}
                <TableCell style={{ border: '1px solid #ddd', textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    style={{ 
                      backgroundColor: getManagerStatus(manager.userId) === 'Assigned In Project' ? '#4caf50' : '#f44336', 
                      color: 'white' 
                    }}
                  >
                    {getManagerStatus(manager.userId)}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Project Manager</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            name="userName"
            value={newManager.userName}
            onChange={handleInputChange}
            error={!!errors.userName}
            helperText={errors.userName}
          />
          <TextField
            margin="dense"
            label="User Mobile"
            type="text"
            fullWidth
            variant="outlined"
            name="userMobile"
            value={newManager.userMobile}
            onChange={handleInputChange}
            error={!!errors.userMobile}
            helperText={errors.userMobile}
          />
          <TextField
            margin="dense"
            label="User Email"
            type="email"
            fullWidth
            variant="outlined"
            name="userEmail"
            value={newManager.userEmail}
            onChange={handleInputChange}
            error={!!errors.userEmail}
            helperText={errors.userEmail}
          />
          <TextField
            margin="dense"
            label="User Address"
            type="text"
            fullWidth
            variant="outlined"
            name="userAddress"
            value={newManager.userAddress}
            onChange={handleInputChange}
          />
          {/* Removed Skills Field */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddManager} color="primary" disabled={loading}>
            Add Project Manager
          </Button>
        </DialogActions>
        {loading && (
          <div className="spinner">
            <div className="loader l1"></div>
            <div className="loader l2"></div>
          </div>
        )} {/* Display loader */}
      </Dialog>

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
          z-index: 9999;
        }
        .loader {
          border: 0 solid transparent;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 5px solid #ccc;
          border-top-color: #333;
          animation: spin 1s linear infinite;
        }
        .loader.l1 {
          animation-delay: -0.5s;
        }
        .loader.l2 {
          animation-delay: -1s;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default ProjectManagerList;
