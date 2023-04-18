import React, { useEffect, useState } from 'react';
import Canvas from '../components/Annotation/Canvas';
import { useParams } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { Box, CircularProgress} from '@mui/material';
import NotificationBar from '../components/NotificationBar';
import axios from 'axios';
import config from '../config.json';
import ImageIcon from '@mui/icons-material/Image';
import { stringToSum } from '../components/Utils';

function ImageDisplay() {

    const {id} = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({msg:"",severity:"success", open:false});
    const [readOnly, setReadOnly] = useState(false);
    const userData = useSelector(state => state.data);

    useEffect(()=>{
        setLoading(true);
        axios.get(`${config['path']}/image/data/${id}`,{
            headers: {
                'Authorization': `Bearer ${userData.accessToken.token}`,
                'email': userData.email,
            },
            withCredentials: true
        }).then(res=>{
            res.data.img = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/150150/bug-${stringToSum(res.data._id)%18 + 1}.jpg`
            setData(res.data);
            setLoading(false);
            if(res.data.status == "Review Requested"||
            res.data.status == "Approved"){
                setReadOnly(true);
            }
        }).catch(err=>{
            if(err.response) showMsg(err.response.data.message, "error")
            else alert(err)
        })

    },[])

    const showMsg = (msg, severity)=>{
        setStatus({msg, severity, open:true})
    }
    
    return (
        <div>
            <Box className='body'>
                {loading? 
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'100%' }}>
                <Box sx={{position: 'relative'}}>
                    <ImageIcon fontSize='large' color='disabled' className='center'/>
                    <CircularProgress size={100}/>
                </Box>
                </Box>
                :<Canvas data={data} readOnly={readOnly} />}
            </Box>
            {/* <Box className='body' sx={{display: { xs: 'block', sm: 'none' } }} >
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'100%' }}>
                <Box sx={{position: 'relative', textAlign:'center'}}>
                    <ImageNotSupported fontSize='large' color='primary' />
                    <Typography>Not available for mobile view</Typography>
                </Box>
                </Box>
            </Box> */}
            <NotificationBar status={status} setStatus={setStatus}/>
        </div>
    );
}

export default ImageDisplay;
