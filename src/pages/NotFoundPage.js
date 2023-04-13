import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Stack } from '@mui/material';
import notfound from '../Assets/computer.png'
const NotFoundPage = () => {

    const navigate = useNavigate();

    return (
        <div className="App">
        <header className="App-header">
        <Paper sx={{p:3, width:'400px'}}>
        <Stack direction='column' alignItems='center' spacing={2}>
            <img src={notfound} className="App-logo" alt="logo" />
           
            <small>PAGE NOT FOUND</small>
            
            <Button variant='contained' onClick={() => navigate(-1)}>Go Back</Button>
        </Stack>
        </Paper>
        </header>
        </div>
    );
};

export default NotFoundPage;