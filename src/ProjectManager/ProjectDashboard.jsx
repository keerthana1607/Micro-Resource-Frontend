import * as React from 'react';
import { Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LogoutIcon from '@mui/icons-material/Logout';
import { Route, Routes, Link } from 'react-router-dom';
import EditNoteIcon from '@mui/icons-material/EditNote';
// import AddProject from './AddProject'; // Import AddProject component
// import ViewProjects from './ViewProjects'; // Import ViewProjects component
// import TrackProject from './TrackProject'; // Import TrackProject component

const drawerWidth = 240;

const ProjectManagerDashboard = ({ children }) => {
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
        <ListItem button component={Link} to="/managerhome">
          <HomeIcon />
          <ListItemText primary="Home" />
        </ListItem>
       
        <ListItem button component={Link} to="/view-projects">
          <VisibilityIcon />
          <ListItemText primary="View Projects" />
        </ListItem>
        <ListItem button component={Link} to="/track-project">
          <TrackChangesIcon />
          <ListItemText primary="Track Project" />
        </ListItem>
        <ListItem button component={Link} to="/editmanager">
          <EditNoteIcon />
          <ListItemText primary="Edit Profile" />
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
            startIcon={<LogoutIcon />}
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
            Project Manager Dashboard
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

export default ProjectManagerDashboard;
