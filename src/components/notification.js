import React, { useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';

function NotificationPopup() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newItemsCount, setNewItemsCount] = useState(0); // Track new items count
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('http://51.20.225.234:6990/api/get-notification', {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      const newNotifications = data.data;

      // Calculate new items count
      const newItems = newNotifications.filter(notification => !notifications.some(n => n.id === notification.id));
      const newItemsCount = newItems.length;

      // Update state and global data if there are changes
      if (JSON.stringify(newNotifications) !== JSON.stringify(global.notificationData)) {
        global.notificationData = newNotifications;
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.length);
        setNewItemsCount(newItemsCount);

        // Show Snackbar only if the popup is not open
        if (!anchorEl) {
          enqueueSnackbar('New notifications received!', { variant: 'info' });
        } else {
          closeSnackbar();
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [anchorEl, notifications, enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 1000); // Fetch every second
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchNotifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); // Reset unread count when popup is opened
    setNewItemsCount(0); // Reset new items count when popup is opened
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      >
        <Box p={2} sx={{ width: 300 }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Box key={index} sx={{ marginTop: 1 }}>
                <Typography variant="body2">{notification.type}</Typography>
                {/* Show new items count */}
                {notification.isNew && <Typography variant="caption" color="textSecondary">New</Typography>}
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
}

export default NotificationPopup;
