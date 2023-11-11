import React, {useEffect, useState} from 'react';
import logo from '../Assets/logo.png';
import { Paper, Stack, Box, Typography, Divider, Button, TextField, FormControl, Select, InputLabel, MenuItem, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationBar from '../components/NotificationBar';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { MuiTelInput } from 'mui-tel-input';
import { RestartAlt } from '@mui/icons-material';

function SignuPage() {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(false);
    const [email, setEmail] = useState(null);
    const [picture, setPicture] = useState('');
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [value, setValue] = useState('+94');
    const [hospital, setHospital] = useState("");
    const [hospitalList, setHospitalList] = useState([]);

    const navigate = useNavigate();

    function handleCallBackResponse(response){
        var userObject = jwt_decode(response.credential);
        setEmail(userObject.email);
        setPicture(userObject.picture)
        setDetails(true);
    }


    const handleSignUpSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if(data.get('email')==="" || data.get('regNo')==="" 
        || data.get('username')==="" || data.get('contactNo').length <= 4 || hospital===""){
            showMsg("Cannot leave required fields empty","error")
            return
        }

        if(data.get("username").length < 5){
            showMsg("Username is too short","error")
            return
        }

        setLoading(true)
        axios.post(`${process.env.REACT_APP_BE_URL}/auth/signup`, {
                username: data.get('username'),
                email: email,
                reg_no: data.get('regNo'),
                hospital: hospital,
                contact_no: data.get('contactNo'),
                picture:picture
            })
            .then(function (response) {
                showMsg(response.data?.message, "success")
            })
            .catch(function (error) {
                if(error.response?.data?.message) showMsg(error.response.data.message, "error")
                else showMsg("Error!", "error")
            }).finally(()=>{
                setLoading(false)
            });
    };

    const handleChange = (newValue) => {
        setValue(newValue)
    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const errorMessage = ()=>{
        showMsg("Failed to login",'error')
    }

    const goToLogin = () =>{
        navigate('/login')
    }

    useEffect(()=>{
        
        axios.get(`${process.env.REACT_APP_BE_URL}/user/self/hospitals`,
        {
            withCredentials: true
        }
        ).then(res=>{
            setHospitalList(res.data);
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else showMsg("Error!", "error")
        })
        

    },[])
    
    return (
        <div className="App">
        <header className="App-header">
            <Paper sx={{maxWidth:'400px', width:'100%', m:3, maxHeight:'80vh', overflow:'auto'}} className='custom_scrollbar'>
            <Box sx={{p:3}}>
            <Stack direction='column' alignItems='center' spacing={2}>
                {details? "":<img src={logo} className="App-logo" alt="logo" />}
                <Typography variant='h5' className='App-title'>OASIS Annotation Tool</Typography>
                <Divider sx={{width:'100%', "&::before, &::after": {borderColor: "black",},}}>Sign up</Divider>
                {details?
                     <Box component="form" noValidate onSubmit={handleSignUpSubmit} sx={{ mt: 1, width:'100%'}}>
                        <Stack direction='column' spacing={2}>
                        <TextField disabled size='small' value={email} inputProps={{ maxLength: 100}} required fullWidth id="email" label="Email" name="email"
                        InputProps={{
                            endAdornment: (
                              <Tooltip arrow placement="bottom-end" title='change email'><IconButton onClick={()=>setDetails(false)} size='small'><RestartAlt fontSize='small' /></IconButton></Tooltip>
                            ),
                          }}
                        />
                        <TextField size='small' inputProps={{ maxLength: 100}} required fullWidth id="username" label="Username" name="username"/>
                        <TextField size='small' inputProps={{ maxLength: 100}} required fullWidth id="regNo" label="SLMC Registration Number" name="regNo"/>
                        <MuiTelInput value={value} onChange={handleChange} size='small' name='contactNo' placeholder='Phone Number' fullWidth/>
                        <FormControl size='small' required>
                            <InputLabel id="hospital">Hospital</InputLabel>
                            <Select fullWidth size='small'  value={hospital} labelId="hospital" label="Hospital" onChange={(e)=>setHospital(e.target.value)} sx={{ mb:1}}>
                                {
                                    hospitalList.map((place, index) => {
                                        return(<MenuItem  key={index} value={place.name}>{place.name}</MenuItem>)
                                    })
                                }
                                <MenuItem value={'other'}>Other</MenuItem>
                            </Select>
                        </FormControl>
                                        
                        <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >Request to Register</Button>
                        </Stack>
                    </Box>
                :
                <GoogleLogin onSuccess={handleCallBackResponse} onError={errorMessage}
                    theme="filled_black"
                    size="large"
                    type= "standard"
                    useOneTap
                />
                }
                <Stack direction='row' alignItems='center'>
                    <Typography>Already have an account?</Typography>
                    <Button color='info' size='small' onClick={goToLogin}>Login</Button>
                </Stack>
            </Stack>
            </Box>
            </Paper>
        
        </header>
        <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default SignuPage;
