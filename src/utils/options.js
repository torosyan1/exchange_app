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
  }else if(status === 4) {
    colorStatus = 'gray'
  }else if(status === 6){
    colorStatus='#00FFFF'
  }else if(status === 6){
    colorStatus='black'
  }else if(status === 8){
    colorStatus='#5e35b1'
  }
  const handleChange = async (event) => {
    const newStatus = event.target.value;
    const updatePath = {
      'auth': 'update-auth-status',
      'buy': 'update-buy-status',
      'sell': 'update-sell-status',
    }
    const message = {
      "auth-2": `کاربر گرامی متاسفانه احراز هویت شما بنا به یکی از دلایل زیر ناموفق بوده است.
- وارد کردن اشتباه نام و نام خانوادگی
- وارد کردن اشتباه شماره کارت بانکی
- وارد کردن اشتباه نام بانک
- وارد کردن اشتباه شماره ملی
- عدم همخوانی شماره ملی با مشخصات بانکی
- عدم همخوانی اطلاعات کارت ملی با اطلاعات بانکی

لطفا" مراحل را مجدد انجام دهید و دقت کنید تا تمام اطلاعات دقیق و کامل نوشته شود`,
"auth-1": `احراز هویت انجام شد.

مدارک شما بررسی و احراز هویت شما موفقیت آمیز بود 

از این پس شما میتوانید به راحتی فقط با چند کلیک ارز بخرید یا بفروشید.

موفق باشید.`,
"auth-0": `در حین بررسی مدارک ارسالی شما مشکلی پیش آمده ،
 چند لحظه صبر کنید تا توضیحات دقیق در رابطه با مشکل پیش آمده را پشتیبان های ما به اطلاع شما برسانند`,

// 'sell': 'sell',
// 'buy': 'buty'
    }
    setStatus(newStatus);
    console.log(message[`${path}-${newStatus}`], `${path}-${newStatus}`)
    try {
      await axios.post(`http://51.20.225.234:6990/api/${updatePath[path]}`, {
        id: data.id,
        status: newStatus,
      },
      {headers: {Authorization: localStorage.getItem('token')}}
    );
      await axios.post('http://51.20.225.234:6990/api/send-messages', {
        telegram_id: data.telegram_id,
        message: message[`${path}-${newStatus}`],
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
          { path ==='buy' || path ==='auth' ? <MenuItem value={4}>Waithing</MenuItem>  : null}
          { path ==='buy' ? <MenuItem value={8}>Transfering</MenuItem>  : null}
          { path ==='auth' ? <MenuItem  value={6}>New</MenuItem>  : null}
          { path ==='auth' ? <MenuItem value={5}>Leaved</MenuItem>  : null}

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
