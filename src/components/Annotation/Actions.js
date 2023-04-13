import React, { useState } from 'react';
import { Avatar, Box, Button, FormControlLabel, Radio, RadioGroup, Stack, TextField} from '@mui/material';
import { ArrowRight, CheckCircle, Comment, RateReview, Save } from '@mui/icons-material';

function Actions() {
    const [action ,setAction] = useState("Action");
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");

    const handleAction = ()=>{

    }

    return (
        <div>
            <Box border={'1px dashed var(--dark-color)'} borderRadius={1} padding={2} marginTop={2}>
            <Stack direction='row'>
                <Avatar/>
                <ArrowRight fontSize='large' color='disabled'/>
                <Stack direction='column' spacing={2} sx={{width:'100%'}}>
                    <TextField fullWidth size='small' placeholder='Title' onChange={(e)=>setTitle(e.target.value)}></TextField>
                    <TextField fullWidth size='small' multiline rows={4} placeholder='Add an optional description' onChange={(e)=>setComment(e.target.value)}></TextField>
                    <RadioGroup name="action" onChange={(e)=>setAction(e.target.value)}>
                        <FormControlLabel value="Save" control={<Radio size='small' />} label="Save"/>
                        <FormControlLabel value="Comment" control={<Radio size='small' />} label="Comment" />
                        <FormControlLabel value="Request Review" control={<Radio size='small' />} label="Request Review" />
                        <FormControlLabel value="Approve" control={<Radio size='small' />} label="Approve" />
                    </RadioGroup>
                    <Button variant='contained' 
                        sx={{minWidth:'150px', width:'fit-content'}} color='success'  
                        disabled={title==="" || action==="Action"}
                        onClick={handleAction}
                        startIcon={
                            action==="Save"? <Save/> :
                            action === "Comment"? <Comment/>:
                            action === "Approve"? <CheckCircle/>:
                            action === "Request Review"? <RateReview/>:
                            null
                        }
                    >{action}</Button>
                </Stack>
            </Stack>
            </Box>
        </div>
    );
}

export default Actions;