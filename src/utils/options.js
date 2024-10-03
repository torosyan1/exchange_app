import React, { useState, useCallback, useMemo, memo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import axios from 'axios';

const SelectLabels = React.memo(({ data, path, statusName, onStatusChange }) => {
  const [status, setStatus] = useState(path === 'sell' || path === 'buy' ? data.status : data.verified);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const handleChange = useCallback(async (event) => {
    const newStatus = event.target.value;
    const updatePath = {
      'auth': 'update-auth-status',
      'buy': 'update-buy-status',
      'sell': 'update-sell-status',
    }
    const message = {
      "auth-0": `در حین بررسی مدارک ارسالی شما مشکلی پیش آمده ،
 چند لحظه صبر کنید تا توضیحات دقیق در رابطه با مشکل پیش آمده را پشتیبان های ما به اطلاع شما برسانند`,
      "auth-1": `احراز هویت انجام شد.

مدارک شما بررسی و احراز هویت شما موفقیت آمیز بود 

از این پس شما میتوانید به راحتی فقط با چند کلیک ارز بخرید یا بفروشید.

موفق باشید.`,
      "auth-2": `کاربر گرامی متاسفانه احراز هویت شما بنا به یکی از دلایل زیر ناموفق بوده است.
- وارد کردن اشتباه نام و نام خانوادگی
- وارد کردن اشتباه شماره کارت بانکی
- وارد کردن اشتباه نام بانک
- وارد کردن اشتباه شماره ملی
- عدم همخوانی شماره ملی با مشخصات بانکی
- عدم همخوانی اطلاعات کارت ملی با اطلاعات بانکی

لطفا" مراحل را مجدد انجام دهید و دقت کنید تا تمام اطلاعات دقیق و کامل نوشته شود`,
      "auth-4": `کاربر گرامی ، مدارک شما در حال بررسی می باشد لطفا منتظر بمانید تا احراز هویت شما تایید گردد.
بلافاصله بعد از تایید مدارک شما پیام موفقیت برای شما ارسال خواهد شد`,
      "auth-6": `شما در مرحله اول احراز هویت هستید لطفا جهت خرید و فروش مراحل سریع احراز هویت را طی کنید`,
      "auth-5": `leved`,
      'buy-0': `"تشکر  ، لطفا چند لحظه صبر کنید تا بررسی کنم اگر وجه دریافت شده کد ووچر و کد فعال سازی را خدمت شما ارسال کنم.

این عملیات شاید چند دقیقه طول بکشد.

ممنون از صبر و شکیبایی شما.
"`,
      'buy-1': `کد ووچر و کد فعال سازی برای شما ارسال شد.
از اینکه از خدمات صرافچی استفاده کردید بسیار مفتخریم
به امید دیدار مجدد`,
      'buy-2': `متاسفانه وجه انتقالی شما در حساب بانکی مقصد دریافت نشده است.
لطفا" تا 72 ساعت منتظر بمانید تا به حساب خود شما برگشت داده شود در غیر این صورت بعد از گدشت 72 ساعت به پشتیبانی صرافچی مراجعه نمایید.`,
      'buy-4': `بسیار عالی ، 

لطفا کمی صبر کنید ، بزودی شماره کارت ارسال میکنیم تا شما وجه مورد نظر را انتقال دهید`,
      'buy-8': `لطفا پس از واریز وجه رسید خود را همینجا ارسال کنید و بر روی گزینه انتقال دادم و رسید را فرستادم کلیک کنید`,
      'sell-0': `بسیار متشکریم
کد ووچر ارسال شده از طرف شما مورد تایید می باشد

لطفا چند دقیقه صبر کنید تا وجه ریالی شما را به کارتی که با آن احراز هویت انجام دادید انتقال دهیم.`,
      'sell-1': `وجه مورد نظر به کارت شما انتقال داده شد.

از اینکه به صرافچی اعتماد کردید بسیار خرسندیم.

به امید دیدار مجدد`,
      'sell-2': `متاسفانه کد ووچر ارسالی شما اشتباه است و یا قبلا استفاده شده است.
لطفا مراحل فروش ووچر پرفکت مانی را از ابتدا طی کنید و دقت کنید کد های وارد شده صحیح باشد.`,
'sell-4': `بسیار عالی ، ممنون از اطلاعات ارسالی

لطفا چند دقیقه صبر کنید تا اطلاعات ارسالی شما بررسی و تایید شود.`,
    }
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

export default memo(SelectLabels); // This prevents unnecessary re-renders

