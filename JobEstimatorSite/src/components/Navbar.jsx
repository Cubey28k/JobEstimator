import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Use user directly from context
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogoutClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h5" 
            component={Link} 
            to={user ? "/estimate" : "/"} 
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Job Estimator
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!user ? (
              <>
                <Button color="inherit" component={Link} to="/estimate">Try</Button>
                <Button color="inherit" component={Link} to="/about">About</Button>
                <Button color="inherit" component={Link} to="/">Login</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/about">About</Button>
                <Button color="inherit" onClick={handleLogoutClick}>Log Out</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;