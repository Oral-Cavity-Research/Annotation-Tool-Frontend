import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import NotificationBar from '../NotificationBar';

function SaveChanges({saving, handleSave, direction}) {

    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const navigate = useNavigate();
    const userData = useSelector(state => state.data);

    const handleLeave = ()=>{
        if(direction === -1){
            navigate("/home/images");
        }else{
            navigate("/image/"+ direction)
        }
    }

    const handleSaveandLeave = ()=>{
        if(userData?.permissions?.includes(90)){
            showMsg("Unauthorized Access","error")
            return;
        };

        handleSave();
        handleLeave();
    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    return (
        <Stack direction='column' spacing={2} justifyContent='center' alignItems='center' sx={{my:5}}>
            <Typography>You have unsaved changes, are you sure you want to leave?</Typography>
            <Stack direction='row' spacing={2}>
                <LoadingButton loading={saving} size='small' variant='contained' color='primary' onClick={handleSaveandLeave}>Save</LoadingButton>
                <Button variant='contained' color='error' onClick={handleLeave}>Leave</Button>
            </Stack>
            <NotificationBar status={status} setStatus={setStatus}/>
        </Stack>
    );
}

export default SaveChanges;