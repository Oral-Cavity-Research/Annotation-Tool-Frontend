import React, { useEffect, useState } from 'react';
import { Avatar, Box, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography} from '@mui/material';
import { AddComment, ArrowRight, CheckCircle, Comment, LockOpen, RateReview, Save, TaskAlt, Warning } from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import { useSelector} from 'react-redux';
import axios from 'axios';

const messageNeeded = ["Comment", "Request Changes"]

function Actions({showMsg, coordinates, data, unsaved, location, clinicalDiagnosis, setTogglePanel, setData}) {

    const userData = useSelector(state => state.data);
    const [action ,setAction] = useState("Action");
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState(false);

    useEffect(()=>{
        if((title==="" && messageNeeded.includes(action))) setErrorText(true);
        else setErrorText(false);
    },[title, action])

    const handleAction = ()=>{
        setLoading(true);
    
        axios.post(`${process.env.REACT_APP_BE_URL}/image/annotate/${data._id}`,
        {
            location:location,
            clinical_diagnosis:clinicalDiagnosis,
            annotation: coordinates,
            status: action,
            title,
            comment,
        },
        { headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        }}).then(res=>{
            showMsg("Successful!", "success");
            res.data.img = `${process.env.REACT_APP_IMAGE_PATH}/${res.data.image_path}/${res.data.image_name}`
            setData(res.data);
            setTogglePanel(false);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data?.message, "error")
            else showMsg("Error!", "error")
        }).finally(()=>{
            setLoading(false);
        })
    }

    const changed = ()=>{
        return unsaved
    }

    return (
        <div>
            <Box border={'1px dashed var(--dark-color)'} borderRadius={1} padding={2} marginTop={2}>
            <Stack direction='row'>
                <Avatar src={userData.picture} alt={userData.username?userData.username:""}></Avatar>
                <ArrowRight fontSize='large' color='disabled'/>
                <Stack direction='column' spacing={2} sx={{width:'100%'}}>
                    <TextField fullWidth error={errorText} helperText={errorText? "Please enter a meaningful message":null} size='small' label='Message' onChange={(e)=>setTitle(e.target.value)} inputProps={{ maxLength: 100 }}></TextField>
                    <TextField fullWidth size='small' multiline rows={4} placeholder='Add an optional description' onChange={(e)=>setComment(e.target.value)} inputProps={{ maxLength: 1000 }}></TextField>
                    {
                        data.status === "New" &&
                        <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                            { changed() && <FormControlLabel value="Save" control={<Radio size='small' />} label="Save"/>}
                            <FormControlLabel value="Comment" control={<Radio size='small' />} label="Comment" />
                        </RadioGroup>
                    }
                    {
                        (data.status === "Edited" || data.status === "Reviewed" || data.status === "Marked As Resolved" || data.status === "Reopened") &&
                        <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                            { changed() && <FormControlLabel value="Save" control={<Radio size='small' />} label="Save"/>}
                            <FormControlLabel value="Comment" control={<Radio size='small' />} label="Comment" />
                            <FormControlLabel value="Request Review" control={<Radio size='small' />} label="Request Review" />
                            <FormControlLabel value="Approve" control={<Radio size='small' />} label="Approve" />
                        </RadioGroup>
                    }
                    {
                        data.status === "Changes Requested" &&
                        <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                            { changed() && <FormControlLabel value="Save" control={<Radio size='small' />} label="Save"/>}
                            <FormControlLabel value="Comment" control={<Radio size='small' />} label="Comment" />
                            <FormControlLabel value="Mark As Resolved" control={<Radio size='small' />} label="Mark As Resolved"/>
                        </RadioGroup>
                    }
                    {
                        data.status === "Review Requested" &&
                        <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                            <FormControlLabel value="Review" control={<Radio size='small' />} label="Review & Save" />
                            <FormControlLabel value="Request Changes" control={<Radio size='small' />} label="Request Changes"/>
                            <FormControlLabel value="Approve" control={<Radio size='small' />} label="Approve" />
                        </RadioGroup>
                    }
                    {
                        data.status === "Approved" &&
                        <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                            <FormControlLabel value="Reopen" control={<Radio size='small' />} label="Reopen" />
                        </RadioGroup>
                    }
                    {changed() && !(action === "Save" || action === "Action" || action==="Comment" || action==="Review") &&
                    <Stack direction='row' spacing={1} alignItems='center' sx={{mt:2}}>
                        <Warning fontSize='small' color='warning' /><Typography color='GrayText' >You have unsaved changes</Typography>
                    </Stack>
                    }
                    <LoadingButton variant='contained'  loading={loading}
                        sx={{minWidth:'150px', width:'fit-content'}} color='success'  
                        disabled={errorText || action === "Action"}
                        onClick={handleAction}
                        startIcon={
                            action==="Save"? <Save/> :
                            action === "Comment"? <Comment/>:
                            action === "Approve"? <CheckCircle/>:
                            action === "Request Review"? <RateReview/>:
                            action === "Mark As Resolved"? <TaskAlt/>:
                            action === "Request Changes"? <AddComment/>:
                            action === "Reopen"? <LockOpen/>:
                            null
                        }
                    >{action}</LoadingButton>
                </Stack>
            </Stack>
            </Box>
        </div>
    );
}

export default Actions;