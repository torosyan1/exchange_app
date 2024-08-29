import React, { useState, useCallback, useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import axios from 'axios';

const SelectLabels = React.memo(({ data, path, statusName, onStatusChange }) => {
  const [status, setStatus] = useState(path === 'sell' || path === 'buy' ? data.status : data.verified);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  console.log(data, path, statusName, onStatusChange )
  const handleChange = useCallback(async (event) => {
    const newStatus = event.target.value;
    const updatePath = {
      'auth': 'update-auth-status',
      'buy': 'update-buy-status',
      'sell': 'update-sell-status',
    };
    const message = {
      "auth-0": "Error message for auth-0",
      "auth-1": "Success message for auth-1",
      // Add other messages here...
    };

    setStatus(newStatus);
    try {
      await axios.post(`http://51.20.225.234:6990/api/${updatePath[path]}`, {
        id: data.id,
        status: newStatus,
      }, { headers: { Authorization: localStorage.getItem('token') } });

      await axios.post('http://51.20.225.234:6990/api/send-messages', {
        telegram_id: data.telegram_id,
        message: message[`${path}-${newStatus}`],
        username: localStorage.getItem('username')
      }, { headers: { Authorization: localStorage.getItem('token') } });

      setAlert({ show: true, message: 'Status updated successfully!', severity: 'success' });
      if (onStatusChange) onStatusChange(newStatus); // Notify parent about status change
    } catch (error) {
      console.error('Error updating status:', error);
      setAlert({ show: true, message: 'Error updating status!', severity: 'error' });
    }
  }, [data, path, onStatusChange]);

  const colorStatus = useMemo(() => {
    switch (status) {
      case 0: return 'orange';
      case 1: return 'green';
      case 2: return 'red';
      case 4: return 'gray';
      case 6: return '#00FFFF';
      case 8: return '#5e35b1';
      default: return '';
    }
  }, [status]);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          style={{ backgroundColor: colorStatus }}
          labelId="status-select-label"
          id="status-select"
          value={status}
          onChange={handleChange}
        >
          <MenuItem value={0}>Pending</MenuItem>
          <MenuItem value={1}>{statusName ? "Done" : "Approved"}</MenuItem>
          <MenuItem value={2}>Rejected</MenuItem>
          {(path === 'buy' || path === 'sell' || path === 'auth') && <MenuItem value={4}>Waiting</MenuItem>}
          {path === 'buy' && <MenuItem value={8}>Transferring</MenuItem>}
          {path === 'auth' && <MenuItem value={6}>New</MenuItem>}
          {path === 'auth' && <MenuItem value={5}>Leaved</MenuItem>}
        </Select>
      </FormControl>
      {alert.show && (
        <Stack sx={{ position: 'fixed', top: '10%', left: '45%' }} spacing={2}>
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Stack>
      )}
    </div>
  );
});

export default SelectLabels;
