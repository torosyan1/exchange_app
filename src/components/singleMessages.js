import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const ApiForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [telegramId, setTelegramId] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTelegramIdChange = (event) => {
    setTelegramId(event.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === '' || telegramId.trim() === '') {
      alert('Please enter both text and Telegram ID');
      return;
    }
    
    try {
      const response = await axios.post('http://51.20.225.234:6990/api/send-status-messages', { message: inputValue, telegram_id: telegramId }, { headers: {Authorization: localStorage.getItem('token')} });
      console.log(response.data);
      alert('Data submitted successfully!');
      setInputValue('');
      setTelegramId('');
    } catch (error) {
      console.error('Error submitting data', error);
      alert('Failed to submit data');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Submit Your Text
        </Typography>
        <TextField
          label="Enter your text"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          sx={{ mb: 3 }}
        />
        <TextField
          label="Enter Telegram ID"
          variant="outlined"
          fullWidth
          value={telegramId}
          onChange={handleTelegramIdChange}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default ApiForm;
