import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function SaveChanges({saving, handleSave, direction}) {

    const navigate = useNavigate();

    const handleLeave = ()=>{
        if(direction === -1){
            navigate("/home/images");
        }else{
            navigate("/image/"+ direction)
        }
    }

    const handleSaveandLeave = ()=>{
        handleSave();
        handleLeave();
    }

    return (
        <Stack direction='column' spacing={2} justifyContent='center' alignItems='center' sx={{my:5}}>
            <Typography>You have unsaved changes, are you sure you want to leave?</Typography>
            <Stack direction='row' spacing={2}>
                <LoadingButton loading={saving} size='small' variant='contained' color='primary' onClick={handleSaveandLeave}>Save</LoadingButton>
                <Button variant='contained' color='error' onClick={handleLeave}>Leave</Button>
            </Stack>
        </Stack>
    );
}

export default SaveChanges;