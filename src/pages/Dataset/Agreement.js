import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, IconButton, TextField, Radio, RadioGroup, Stack } from '@mui/material';
import {Print } from '@mui/icons-material';
import AgreementNote from './AgreementNote';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import NotificationBar from '../../components/NotificationBar';

const steps = ['Agreement', 'Registration'];

export default function Agreement() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [agreed, setAgreed] = React.useState('');
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [purpose, setPurpose] = React.useState("")
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState({msg:"",severity:"success", open:false});

  const navigate = useNavigate();

  const handleAgreement = (event) => {
    setAgreed(event.target.value);
  };

  const handleNext = () => {
    if(agreed === "disagree"){
        navigate('/dataset/download')
        return
    }
    if(agreed === "agree" && activeStep === 1){

        if(email==="" || affiliation==="" 
        || purpose==="" || fullName===""){
            showMsg("Cannot leave required fields empty","error")
            return
        }

        setLoading(true)
        axios.post(`${process.env.REACT_APP_BE_URL}/dataset/agreement`, {
                fullName,email,
                affiliation, purpose
            })
            .then(function (response) {
                setMessage(response.data?.message);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            })
            .catch(function (error) {
                if(error.response?.data?.message){
                    showMsg(error.response.data.message, "error")
                }else{
                    alert(error, "error")
                }
            }).finally(()=>{
                setLoading(false)
            });
        
    }else{
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }

  return (
    <Box className="bodywidth clear">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ my:5, mx:2 }}>
        {message === "User exists"?
        <>
        <h1><strong>Email address already in use!</strong></h1>
        <br/>
        <h2>Please use your passkey to download the dataset. If you have forgotten your passkey please request a new passkey from <span className='blue'>ocr.tech.team@gmail.com</span></h2>
        </>
        :
        <>
        <h1 style={{color:'green'}}><strong>User is Registered successfully!</strong></h1>
        <br/>
        <h2>Your passkey has been sent to your email. If you haven't received your passkey, please contact us via <span className='blue'>ocr.tech.team@gmail.com</span></h2>
        </>
        }
        <Button sx={{my:5}} variant='contained' onClick={()=>navigate("/dataset/download")}>Download Dataset</Button>
        </Box>
      ) : (
        <>
          <Box sx={{ my:5, mx:2 }}>
            {activeStep === 0 &&
            <>
            {/* <h3>End User Agreement</h3> */}
            <Stack direction='row-reverse'>
                <IconButton color='inherit' href={`${process.env.REACT_APP_IMAGE_PATH}OASISdataset End User Agreement.pdf`} target="_blank" download="OASISdataset End User Agreement.pdf" size='small'><Print/></IconButton>
            </Stack>
            <div className='licenseBox'>
                <AgreementNote/>
            </div>
            <p>If you agree to the terms of this agreement, please select the first option below. Accepting this agreement is a prerequisite for receiving a passkey for dataset downloads. Click 'Next' to proceed.</p>
            <FormControl size='small'>
            <RadioGroup aria-labelledby="radio-buttons-group" value={agreed} onChange={handleAgreement}>
                <FormControlLabel value="agree" control={<Radio size='small' />} label="I accept the terms in the License Agreement" />
                <FormControlLabel value="disagree" control={<Radio size='small' />} label="I do not accept the terms in the License Agreement" />
            </RadioGroup>
            </FormControl>
            </>}
            {
            activeStep === 1 && agreed === "agree" &&
            <>
            <h1>User Registrations</h1>
            <Stack direction='column' my={5} spacing={2}>
                <TextField size='small' inputProps={{ maxLength: 1000}} value={fullName} onChange={(e)=>setFullName(e.target.value)} required fullWidth label="Full Name" helperText="Full name of the applicant"/>
                <TextField size='small' inputProps={{ maxLength: 1000}} value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth label="Email"  helperText="A working email address to receive the passkey"/>
                <TextField size='small' inputProps={{ maxLength: 1000}} value={affiliation} onChange={(e)=>setAffiliation(e.target.value)} required fullWidth label="Affiliation Webpage"  helperText="A webpage where your affiliation/position/email can be verified"/>
                <TextField size='small' inputProps={{ maxLength: 1000}} value={purpose} onChange={(e)=>setPurpose(e.target.value)} required fullWidth label="Purpose of the study" multiline  helperText="A few sentences about how you intend to use the dataset"/>
            </Stack>
            </>
            }
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant='contained' color="inherit" disabled={activeStep === 0 || loading} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <LoadingButton loading={loading} variant='contained' disabled={agreed===""} onClick={handleNext}>
              {agreed === "disagree"? 'Finish' :  activeStep === steps.length - 1? 'Register' : 'Next'}
            </LoadingButton>
          </Box>
          <NotificationBar status={status} setStatus={setStatus}/>
        </>
      )}
    </Box>
  );
}