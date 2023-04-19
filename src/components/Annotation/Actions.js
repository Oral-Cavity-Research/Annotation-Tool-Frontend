import React, { useState } from 'react';
import { Avatar, Box, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography} from '@mui/material';
import { AddComment, ArrowRight, CheckCircle, Comment, LockOpen, RateReview, Save, TaskAlt, Warning } from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import { useSelector} from 'react-redux';
import NotificationBar from '../NotificationBar';
import axios from 'axios';
import config from '../../config.json';

function Actions({coordinates, data, unsaved, location, clinicalDiagnosis, lesion, setTogglePanel}) {

    const [status, setStatus] = useState({msg:"",severity:"success", open:false}) 
    const userData = useSelector(state => state.data);
    const [action ,setAction] = useState("Action");
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const handleAction = ()=>{
        setLoading(true);
    
        axios.post(`${config['path']}/image/annotate/${data._id}`,
        {
            location:location,
            clinical_diagnosis:clinicalDiagnosis,
            lesions_appear:lesion,
            annotation: coordinates,
            status: action,
            title,
            comment,
        },
        { headers: {
            'Authorization': `Bearer ${userData.accessToken.token}`,
            'email': userData.email,
        }}).then(res=>{
            showMsg("Image Data Updated", "success");
            if(action === "Comment"){
                setTogglePanel(false);
            }else{
                window.location.reload(true);
            }
        }).catch(err=>{
            if(err.response) showMsg(err.response.data?.message, "error")
            else alert(err)
        }).finally(()=>{
            setLoading(false);
        })
    }

    const changed = ()=>{
        return unsaved || 
        (data.location !== location ||
        data.clinical_diagnosis !== clinicalDiagnosis ||
        data.lesions_appear !== lesion)
    }

    return (
        <div>
            <Box border={'1px dashed var(--dark-color)'} borderRadius={1} padding={2} marginTop={2}>
            <Stack direction='row'>
                <Avatar/>
                <ArrowRight fontSize='large' color='disabled'/>
                <Stack direction='column' spacing={2} sx={{width:'100%'}}>
                    <TextField fullWidth size='small' placeholder='Title' onChange={(e)=>setTitle(e.target.value)} inputProps={{ maxLength: 100 }}></TextField>
                    <TextField fullWidth size='small' multiline rows={4} placeholder='Add an optional description' onChange={(e)=>setComment(e.target.value)} inputProps={{ maxLength: 1000 }}></TextField>
                    {
                        (data.status === "New" || data.status === "Marked As Resolved" || data.status === "Reviewed" || data.status === "Reopened") &&
                        <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                            { changed() && <FormControlLabel value="Save" control={<Radio size='small' />} label="Save"/>}
                            <FormControlLabel value="Comment" control={<Radio size='small' />} label="Comment" />
                        </RadioGroup>
                    }
                    {
                        data.status === "Edited" &&
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
                            <FormControlLabel value="Review" control={<Radio size='small' />} label="Review" />
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
                    {changed() && !(action === "Save" || action === "Action" || action==="Comment") &&
                    <Stack direction='row' spacing={1} alignItems='center' sx={{mt:2}}>
                        <Warning fontSize='small' color='warning' /><Typography color='GrayText' >You have unsaved changes</Typography>
                    </Stack>
                    }
                    <LoadingButton variant='contained'  loading={loading}
                        sx={{minWidth:'150px', width:'fit-content'}} color='success'  
                        disabled={title==="" || action==="Action"}
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
            <NotificationBar status={status} setStatus={setStatus}/>
            </Box>
        </div>
    );
}

export default Actions;