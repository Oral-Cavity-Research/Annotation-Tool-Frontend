import React, {useState} from 'react';
import logo from '../Assets/logo.png';
import { Paper, Stack, Box, Typography, Divider, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationBar from '../components/NotificationBar';
import { useDispatch } from 'react-redux';
import { setUserData } from '../Reducers/userDataSlice';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Storage } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';


function LoginPage() {
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

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

            navigate("/notice");
            
        })
        .catch(function (error) {
            if(error.response) showMsg(error.response.data?.message, "error")
            else showMsg("Error!", "error")
        }).finally(()=>{
            setLoading(false)
        })
    };

    function handleCallBackResponse(response){
        var userObject = jwt_decode(response.credential);
        var email = userObject.email;

        axios.post(`${process.env.REACT_APP_BE_URL}/auth/verify`, {
            email: email,
            picture: userObject.picture
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
            if(error.response) showMsg(error.response.data?.message, "error")
            else showMsg("Error!", "error")
        })

    }

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

    const errorMessage = ()=>{
        showMsg("Failed to login",'error')
    }

    const goTosignup = () =>{
        navigate('/signup')
    }

    const goToDB = ()=>{
        navigate('/dataset/description');
    }
    
    return (
        <div className="App">
        <header className="App-header">
            <Box position='absolute' top={0} right={0} p={3}>
                <Button onClick={goToDB} size='large' startIcon={<Storage fontSize='large' />}>Public DB</Button>
            </Box>
            <Paper sx={{maxWidth:'400px', width:'100%'}}>
            <Box sx={{p:3}}>
            <Stack direction='column' alignItems='center' spacing={2}>
                <img src={logo} className="App-logo" alt="logo" />
                <Typography variant='h5' className='App-title'>OASIS Annotation Tool</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              size='small'
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              size='small'
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
              loading={loading}
            >
              Sign In
            </LoadingButton>
          </Box>
                <Divider sx={{width:'100%', "&::before, &::after": {borderColor: "black",},}}>Or</Divider>
                <GoogleLogin onSuccess={handleCallBackResponse} onError={errorMessage}
                    theme="filled_black"
                    size="large"
                    type= "standard"
                    useOneTap
                />
                <Stack direction='row' alignItems='center'>
                    <Typography>Don't have an account?</Typography>
                    <Button color='info' size='small' onClick={goTosignup}>Signup</Button>
                </Stack>
            </Stack>
            </Box>
            </Paper>
        
        </header>
        <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default LoginPage;
