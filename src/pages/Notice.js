import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import logo from '../Assets/logo.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowCircleRight} from '@mui/icons-material';

const Notice = () => {
    const userData = useSelector(state => state.data);
    const navigate = useNavigate();

    if(!userData.permissions?.includes(90)){
        navigate('/')
    }

    const handleContinue = ()=>{
        navigate('/home/images')
    }

    return (
        <div className="App">
        <header className="App-header">
            <Paper sx={{maxWidth:'800px', width:'100%'}}>
            <Box sx={{p:3}}>
            <Stack direction='column' alignItems='center' spacing={2}>
                <img src={logo} className="App-logo" alt="logo" />
                <Typography variant='h5' className='App-title'>OASIS Annotation Tool</Typography>
                <Typography fontWeight={700} color='red'>View-Only Access Notice</Typography>
            </Stack>
            <Box p={2}>
                <ol>
                    <li><Typography>Access to this platform is restricted to view-only permissions.</Typography></li>
                    <li><Typography>Users are permitted to review and observe the content without editing or downloading capabilities.</Typography></li>
                    <li><Typography>The purpose of this access level is to maintain data integrity and control modifications.</Typography></li>
                    <li><Typography>Please refrain from attempting to alter or download any information.</Typography></li>
                    <li><Typography>For any required changes or downloads, contact the administrator via <span className="blue">ocr.tech.team@gmail.com</span></Typography></li>
                </ol>



            </Box>
            <Stack direction='row' justifyContent='center'>
                <Button variant='contained' onClick={handleContinue} endIcon={<ArrowCircleRight fontSize='large' />}>Continue</Button>
            </Stack>
            </Box>
            </Paper>
        
        </header>
        </div>
    );
};

export default Notice;