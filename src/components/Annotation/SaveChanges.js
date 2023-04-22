import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Stack, Typography } from '@mui/material';

function SaveChanges({setContent}) {

    const navigate = useNavigate();

    const saveChanges = ()=>{
        setContent("Action");
    }

    const goBack = ()=>{
        navigate(-1);
    }

    return (
        <Stack direction='column' spacing={2} justifyContent='center' alignItems='center' sx={{my:5}}>
            <Typography>You have unsaved changes, are you sure you want to leave?</Typography>
            <Stack direction='row' spacing={2}>
                <Button variant='contained' color='primary' onClick={saveChanges}>Save</Button>
                <Button variant='contained' color='error' onClick={goBack}>Leave</Button>
            </Stack>
        </Stack>
    );
}

export default SaveChanges;