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
import {Stack } from '@mui/material';
import axios from 'axios';

const descriptions = {
    annotation: {
        name: "Annotation.json",
        description: ""
    },
    patientwise: {
        name: "Patientwise_data.csv",
        description: ""
    },
    imagewise: {
        name: "Imagewise_data.csv",
        description: ""
    },
    healthy: {
        name: "Healthy.zip",
        description: ""
    },
    benign: {
        name: "Benign.zip",
        description: ""
    },
    opmd: {
        name: "OPMD.zip",
        description: ""
    },
    oca: {
        name: "OCA.zip",
        description: ""
    },
}
export default function DownloadConfirm({open, setOpen, type}) {

    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [passkey, setPasskey] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");

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

    const handleDownload = () => {
      if (email ==="" || passkey ===""){
        setErrorMsg("Please enter your email and passkey");
        return;
      }

      axios.post(`${process.env.REACT_APP_BE_URL}/dataset/download`, {
          email,
          passkey,
          type: descriptions[type]?.name
      },{responseType: 'blob'})
      .then((response) => {
        const blob = new Blob([response.data], { type: response.headers['content-type']});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = type;
        a.click();
        window.URL.revokeObjectURL(url);
        setOpen(false)
      })
      .catch(function (error) {
          if(error.response?.data?.message){
            setErrorMsg(error.response.data.message)
          }else{
              alert(error, "error")
          }
      })        
    };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><strong>Download </strong>{descriptions[type]?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span style={{color:"red"}}>{errorMsg}</span>
          </DialogContentText>
          <Stack spacing={2} marginY={3}>
          <TextField
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
          <Button variant='contained' color='primary' onClick={handleDownload}>Download</Button>
          <Button variant='contained' color='inherit' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}