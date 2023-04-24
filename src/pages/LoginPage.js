import React, {useEffect, useState} from 'react';
import logo from '../Assets/logo.png';
import { Paper, Stack, Box } from '@mui/material';
// import { TextField, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Stack, Box } from '@mui/material';
// import {LoadingButton} from '@mui/lab';
// import {Visibility, VisibilityOff} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationBar from '../components/NotificationBar';
import { useDispatch } from 'react-redux';
import { setUserData } from '../Reducers/userDataSlice';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function handleCallBackResponse(response){
        var userObject = jwt_decode(response.credential);
        var email = userObject.email;

        console.log(userObject);

        setLoading(true);
        axios.post(`${process.env.REACT_APP_BE_URL}/auth/verify`, {
            email: email
        }, { withCredentials: true })
        .then(function (response) {
            var data = response.data
            
            dispatch(setUserData({
                _id: data.others._id,
                username: userObject.name? userObject.name:userObject.email,
                email: data.others.email,
                role: data.others.role,
                permissions: data.others.permissions,
                accessToken: data.accessToken,
                reg_no: data.others.reg_no,
                picture: userObject.picture
            }))

           
            navigate("/home/images");
            
        })
        .catch(function (error) {
            if(error.response){
                showMsg(error.response.data?.message, "error")
            }else{
                alert(error)
            }
        }).finally(()=>{
            setLoading(false);
        });

    }

    useEffect(()=>{
        const google = window.google;

        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_CLIENT_ID,
            callback: handleCallBackResponse
            
        });

        google.accounts.id.renderButton(
            document.getElementById("signinDiv"),
            {theme:"filled_black", size:"large", type: "standard"}
        );

        google.accounts.id.prompt();
    },[])

    const handleSignInSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        if(data.get('email')==="" || data.get('password')===""){
            showMsg("Cannot leave Required fiels empty",'error')
            return
        }

        
        setLoading(true);

        axios.post(`${process.env.REACT_APP_BE_URL}/auth/login`, {
            email: data.get('email'),
            password: data.get('password')
        }, { withCredentials: true })
        .then(function (response) {
            var data = response.data
            
            dispatch(setUserData({
                _id: data.others._id,
                username: data.others.username,
                email: data.others.email,
                role: data.others.role,
                permissions: data.others.permissions,
                accessToken: data.accessToken,
                reg_no: data.others.reg_no
            }))

           
            navigate("/home/images");
            
        })
        .catch(function (error) {
            if(error.response){
                showMsg(error.response.data?.message, "error")
            }else{
                alert(error)
            }
        }).finally(()=>{
            setLoading(false);
        });

    };

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    return (
        <div className="App">
        <header className="App-header">
            <Paper sx={{maxWidth:'400px', width:'100%'}}>
            <Box component="form" noValidate onSubmit={handleSignInSubmit} sx={{p:3}}>
            <Stack direction='column' alignItems='center' spacing={2}>
            <img src={logo} className="App-logo" alt="logo" />
            {/* <TextField margin="normal" size='small' inputProps={{ maxLength: 100 }} required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus/>
            <FormControl margin="normal" fullWidth variant='outlined'>
            <InputLabel required size='small' htmlFor="password">Password</InputLabel>
            <OutlinedInput required size='small' inputProps={{ maxLength: 100 }} id="password" type={showPassword ? 'text' : 'password'} label="Password" name="password"
                endAdornment={
                <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
            />
            </FormControl>
            <LoadingButton loading={loading} type='submit' fullWidth variant='contained'>Login</LoadingButton> */}
            <div id='signinDiv'></div>
            </Stack>


            </Box>
            </Paper>
        
        </header>
        <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default LoginPage;
