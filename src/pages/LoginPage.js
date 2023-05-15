import React, {useEffect, useState} from 'react';
import logo from '../Assets/logo.png';
import { Paper, Stack, Box, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationBar from '../components/NotificationBar';
import { useDispatch } from 'react-redux';
import { setUserData } from '../Reducers/userDataSlice';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function LoginPage() {
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleCallBackResponse(response){
        var userObject = jwt_decode(response.credential);
        var email = userObject.email;

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
        })

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

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    return (
        <div className="App">
        <header className="App-header">
            <Paper sx={{maxWidth:'400px', width:'100%'}}>
            <Box sx={{p:3}}>
            <Stack direction='column' alignItems='center' spacing={2}>
                <img src={logo} className="App-logo" alt="logo" />
                <Typography variant='h4' className='App-title'>OASIS Annotation Tool</Typography>
                <Divider sx={{width:'100%', "&::before, &::after": {borderColor: "black",},}}>Login As</Divider>
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
