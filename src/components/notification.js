import React, { useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { Divider } from '@mui/material';

function NotificationPopup() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications.reverse());
    const unread = storedNotifications.filter((n) => n.isNew).length;
    setUnreadCount(unread);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('http://51.20.225.234:6990/api/get-notification', {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      
      const existingNotifications = JSON.parse(localStorage.getItem('notifications')) || [];

      const newNotifications = data.data.map((notification) => {
        const existingNotification = existingNotifications.find((n) => n.id === notification.id);
        
        // If notification exists, retain its current 'isNew' value; otherwise set to true
        return {
          ...notification,
          isNew: existingNotification ? existingNotification.isNew : true,
        };
      });

      // Update state and localStorage only if there are new notifications
      if (JSON.stringify(newNotifications) !== JSON.stringify(existingNotifications)) {
        setNotifications(newNotifications.reverse());
        localStorage.setItem('notifications', JSON.stringify(newNotifications));

        const newItems = newNotifications.filter((n) => n.isNew);
        setUnreadCount(newItems.length);
        setNewItemsCount(newItems.length);

        // Show Snackbar for new notifications
        if (newItems.length > 0) {
          enqueueSnackbar(`${newItems.length} new notification(s) received!`, { variant: 'info' });
        } else {
          closeSnackbar();
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 1000); // Fetch every second
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchNotifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
        // Mark all notifications as read and update localStorage
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          isNew: false,
        }));
        setNotifications(updatedNotifications.reverse());
        setUnreadCount(0);
        setNewItemsCount(0);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      {/* Notification Icon with Badge */}
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Popover for Notification Content */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ boxShadow: 3 }} // Add shadow to the popover
      >
        <Box p={2} sx={{ width: 300, backgroundColor: '#fff', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Notifications
          </Typography>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Box key={index} sx={{ marginTop: 1 }}>
                <Divider />
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Red dot for new notifications */}
                  {notification.isNew && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        marginRight: 1,
                      }}
                    />
                  )}
                  <a href={
                    notification.table === 'buy_trx' ? '/buypm' : 
                    notification.table === 'sell_trx' ? '/sellpm' : 
                    notification.table === 'users' ? '/users' : 
                    '#'
                  }>
                    You have {notification.table} update
                  </a>
                </Typography>
                {notification.isNew && (
                  <Typography variant="caption" color="textSecondary">New</Typography>
                )}
                <Divider />
              </Box>
            ))
          ) : (
            <Typography variant="body2">No new notifications</Typography>
          )}
          {/* Display new items count */}
          {newItemsCount > 0 && (
            <Typography variant="body2" color="error">
              {newItemsCount} new items since last check
            </Typography>
          )}
        </Box>
      </Popover>
    </div>
  );
};

export default NotificationPopup;