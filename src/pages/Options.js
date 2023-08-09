import React, { useEffect, useState } from 'react';
import {Typography, Paper, Checkbox, FormControlLabel, FormGroup, Select, MenuItem, Box, TextField, Stack, ListItemText, Grid} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector} from 'react-redux';
import NotificationBar from '../components/NotificationBar';
import axios from 'axios';

const Options = () => {
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const userData = useSelector(state => state.data);
    const [value, setValue] = useState("regions");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [state, setState] = useState(0);
    const [loading, setLoading] = useState(true);
    const [option, setOption] = useState([]);

    const getData = ()=>{
        setLoading(true);
        axios.get(`${process.env.REACT_APP_BE_URL}/option/${value}`,
        {
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            setOption(res.data.options);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
            setOption([])
        }).finally(()=>{
            setLoading(false);
        })
    }

    useEffect(()=>{
        getData();
        setName("");
        setDesc("");
    },[value])

    const handleAdd = (event)=>{
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const label = data.get('label');
        const description = data.get('label-desc');

        if(label === ""){
            showMsg("Please add a proper label name", "error");
            return;
        }

        setState(1);

        axios.post(`${process.env.REACT_APP_BE_URL}/option/add/${value}`,
        {
            label, description
        },
        {
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            showMsg("Option added successfuly", "success")
            getData();
            setName("");
            setDesc("");
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        }).finally(()=>{
            setState(0);
        })
    }

    const handleUpdate = (event)=>{
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        var updatedOptions = [];
        var activeCount = 0;

        for(var i=0; i< option.length; i++){
            var checked = formData.get(`label-${option[i].value}`)!==null;
            updatedOptions.push({
                label: option[i].label,
                value: option[i].value,
                description:option[i].description,
                active: checked
            })

            if(checked) activeCount = activeCount+1;
        }

        if(activeCount === 0){
            showMsg("Atleast add one option", "error");
            return;
        }

        setState(2);
        axios.post(`${process.env.REACT_APP_BE_URL}/option/update/${value}`,
        {
            options: updatedOptions 
        },
        {
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            showMsg("Options updated successfuly", "success")
            getData();
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        }).finally(()=>{
            setState(0);
        })


    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    return (
            <Box sx={{my:5}}>
            <Box component='form' onSubmit={handleUpdate}>
            <Stack direction='column' spacing={2} alignItems='flex-start'>
                <Stack direction='row' alignItems='center' spacing={2}>
                    <Typography >Update: </Typography>
                    <Select size='small' fullWidth value={value} onChange={(e)=>setValue(e.target.value)} sx={{maxWidth: '300px'}}>
                    <MenuItem  value={"regions"}>Annotation Regions</MenuItem>
                    <MenuItem  value={"locations"}>Location</MenuItem>
                    <MenuItem  value={"diagnosis"}>Clinical Diagnosis</MenuItem>
                    </Select>
                    <LoadingButton fullWidth type='submit' loading={state===2} variant='contained'>Update</LoadingButton>
                </Stack>
                {
                    loading?
                    <Typography>Loading...</Typography>
                    :
                    option.length === 0? <Typography color='GrayText'>No Options</Typography>
                    :
                    <FormGroup sx={{px:2, my:3}}>
                        <Grid container>
                        {option.map((item,index)=>{
                            return(
                                <Grid item xs={12} sm={4} md={3} key={index}>
                                <FormControlLabel
                                sx={{display:'flex', alignItems:'flex-start'}}
                                value={item.value}
                                control={<Checkbox defaultChecked={item.active} size='small' name={`label-${item.value}`}/>}
                                label={
                                    <ListItemText primary={item.label} secondary={item.description}></ListItemText>
                                }
                                />
                                </Grid>
                            )
                        })}
                        </Grid>
                    </FormGroup>
                }
            </Stack>
            </Box>
            <Box component='form' mt={5} onSubmit={handleAdd}>
                <Stack direction='column' spacing={2} alignItems='flex-start'>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography>Add: </Typography>
                        <Select size='small' fullWidth value={value} onChange={(e)=>setValue(e.target.value)} sx={{maxWidth: '300px'}}>
                            <MenuItem  value={"regions"}>Annotation Regions</MenuItem>
                            <MenuItem  value={"locations"}>Location</MenuItem>
                            <MenuItem  value={"diagnosis"}>Clinical Diagnosis</MenuItem>
                        </Select>
                        <LoadingButton type='submit' loading={state===1} variant='contained'>Add</LoadingButton>
                    </Stack>
                <TextField fullWidth size='small' placeholder="Name" name='label' value={name} onChange={(e)=>setName(e.target.value)} inputProps={{ maxLength: 50 }}/>
                <TextField fullWidth size='small' placeholder="Optional Description" value={desc} onChange={(e)=>setDesc(e.target.value)} multiline maxRows={4} name='label-desc' inputProps={{ maxLength: 200 }}/>
                </Stack>
            </Box>
            <NotificationBar status={status} setStatus={setStatus}/>
            </Box>
    );
};

export default Options;