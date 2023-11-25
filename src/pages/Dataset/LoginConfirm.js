import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NavLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import {Stack } from '@mui/material';
import axios from 'axios';

export default function LoginConfirm({open, setOpen, setUserData}) {

    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [passkey, setPasskey] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleClose = () => {
        setOpen(false);
        setErrorMsg("");
        setEmail("");
        setPasskey("");
    };

    const handleSubmit = () =>{
        setErrorMsg("")
        axios.post(`${process.env.REACT_APP_BE_URL}/publicdb/image/view/access`, {
            email: email,
            passkey: passkey
        },)
        .then(function (response) {
          setUserData({
            email:email,
            accessToken: response.data.accessToken
          })          
        })
        .catch(function (error) {
          if(error.response?.data?.message){
            setErrorMsg(error.response.data.message)
          }else{
              alert(error, "error")
          }
        })
    }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><strong>Get View Access</strong></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{color:"red"}}>{errorMsg}</span>
          </DialogContentText>
          <Stack spacing={2} marginY={3}>
          <TextField
            focused
            margin="dense"
            id="name"
            label="Email Address"
            fullWidth
            size='small'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <FormControl fullWidth size='small'>
          <InputLabel htmlFor="outlined-adornment-password">Passkey</InputLabel>
          <OutlinedInput
            size='small'
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={passkey}
            onChange={(e)=>setPasskey(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Passkey"
          />
          </FormControl>
          </Stack>
        <DialogContentText>
            If you do not own a passkey, kindly request one by clicking <NavLink to={"/dataset/agreement"}>here</NavLink>.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loading} variant='contained' color='primary' onClick={handleSubmit}>Submit</LoadingButton>
          <Button variant='contained' color='inherit' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}