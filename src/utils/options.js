import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function SelectLabels({ data, path, statusName }) {
  const [status, setStatus] = React.useState(path === 'sell' || path==='buy' ? data.status :data.verified);
  const [alert, setAlert] = React.useState({ show: false, message: '', severity: 'success' });
  let colorStatus = '';

  if(status === 0) {
    colorStatus ='orange'
  } else if( status === 1) {
    colorStatus ='green'
  } else if(status === 2) {
    colorStatus = 'red'
  }
  const handleChange = async (event) => {
    const newStatus = event.target.value;
    const updatePath = {
      'auth': 'update-auth-status',
      'buy': 'update-buy-status',
      'sell': 'update-sell-status',
    }
    const message = {
      auth: `
ار اینکه از خدمات صرافچی استفاده کردید بسیار متشکریم و مفتخریم تا بزودی مجدد سعادت دیدار شما را داشته باشیم.
با تشکر

در صورت نیاز به شروع عملیات جدید لطفا از منو اصلی استفده نمایید.`
    }
    setStatus(newStatus);
    try {
      await axios.post(`http://51.20.225.234:6990/api/${updatePath[path]}`, {
        id: data.id,
        status: newStatus,
      },
      {headers: {Authorization: localStorage.getItem('token')}}
    );
    console.log(message[path])
      await axios.post('http://51.20.225.234:6990/api/send-messages', {
        telegram_id: data.telegram_id,
        message: message[path],
        username: localStorage.getItem('username')
      },{
        headers: {Authorization: localStorage.getItem('token')
}
      });
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
          <MenuItem value={1}>{ statusName ? "Done"  : "Approved"}</MenuItem>
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
