import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function SelectLabels({ data }) {
  const [status, setStatus] = React.useState(data.verified);
  const [alert, setAlert] = React.useState({ show: false, message: '', severity: 'success' });
  let colorStatus = '';

  if(status === 0) {
    colorStatus ='orange'
  } else if( status === 1) {
    colorStatus ='green'
  } else if(status === 2) {
    colorStatus = 'red'
  }
  console.log(data)
  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    try {
      await axios.post('http://localhost:6990/api/updateStatus', {
        id: data.id,
        status: newStatus,
      },
      {headers: {Authorization: localStorage.getItem('token')}}
    );
      await axios.post('http://localhost:6990/api/send-status-messages', {
        telegram_id: data.telegram_id,
        message: newStatus + 'ba privet inch ka',
        headers: {Authorization: localStorage.getItem('token')}
      });
      console.log(`Status updated to ${newStatus} for id ${data.id}`);
      setAlert({ show: true, message: 'Status updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating status:', error);
      setAlert({ show: true, message: 'Error updating status!', severity: 'error' });
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          style={{ backgroundColor: colorStatus }}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={status}
          onChange={handleChange}
        >
          <MenuItem value={0}>Pending</MenuItem>
          <MenuItem value={1}>Approved</MenuItem>
          <MenuItem value={2}>Rejected</MenuItem>
        </Select>
      </FormControl>
      {alert.show && (
        <Stack sx={{ position: 'fixed', top: '10%', left: '45%' }} spacing={2}>
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Stack>
      )}
    </div>
  );
}
