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
    const [successMsg, setSuccessMsg] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleClose = () => {
        setOpen(false);
        setSuccessMsg("");
        setErrorMsg("");
        setLoading(false);
        setEmail("");
        setPasskey("");
    };

    const handleDownload = () => {
      if (email ==="" || passkey ===""){
        setErrorMsg("Please enter your email and passkey");
        return;
      }
      setLoading(true);
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_BE_URL}/dataset/session`,
        data: {
          email,
          passkey,
        },
      })
    
      .then((response) => {
        const sessionID = response.data.sessionId;

        // trigger download through webbroswer
        const url = window.URL.createObjectURL(new Blob());
        const downloadLink = document.createElement('a');
        downloadLink.href = `${process.env.REACT_APP_BE_URL}/dataset/download?sessionID=${sessionID}&fileName=${descriptions[type].name}`; 
        downloadLink.download = descriptions[type].name; 
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setSuccessMsg("Download started. Please check your browser download bar.");
        // setLoading(false);
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
          <DialogContentText>
            <span style={{color:"green"}}>{successMsg}</span>
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
          <LoadingButton loading={loading} variant='contained' color='primary' onClick={handleDownload}>Download</LoadingButton>
          <Button variant='contained' color='inherit' onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}