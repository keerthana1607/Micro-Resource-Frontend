import * as React from 'react';
import { Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemText, Divider, Button, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { Route, Routes, Link } from 'react-router-dom';
import PieChart from './PieChart'; // Import PieChart component
import Barchart from './Barchart';

const drawerWidth = 240;

const Ad = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    window.location.href = '/'; // Redirect to home page
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component={Link} to="/admin">
          <HomeIcon />
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/projects">
          <WorkIcon />
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button component={Link} to="/employeeslist">
          <PeopleIcon />
          <ListItemText primary="Employees" />
        </ListItem>
        <ListItem button component={Link} to="/managerlist">
          <PeopleIcon />
          <ListItemText primary="Project Manager" />
        </ListItem>
        <ListItem button component={Link} to="/projecttracking">
        <TrackChangesIcon />
          <ListItemText primary="Projects Tracking" />
        </ListItem>
        <ListItem button component={Link} to="/notifications">
          <NotificationsIcon />
          <ListItemText primary="Notifications" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ margin: '16px', width: '100%' }}
          >
            Logout
          </Button>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: 'black' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'black',
            color: 'white',
          },
        }}
        variant="persistent"
        anchor="left"
        open
      >
        {drawer}
      </Drawer>
      <main
        style={{
          flexGrow: 1,
          padding: '24px',
          marginTop: '64px',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Ad;
